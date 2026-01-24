import React, { useEffect, useState } from "react";
import { loadRobotRugbyTeamsFromCSV } from "../utils/csvParser";
import "../index.css";

const FALLBACK_TEAMS = [
  { id: "T001", TeamName: "Team Alpha" },
  { id: "T002", TeamName: "Team Beta" },
  { id: "T003", TeamName: "Team Gamma" },
  { id: "T004", TeamName: "Team Delta" },
  { id: "T005", TeamName: "Team Epsilon" },
  { id: "T006", TeamName: "Team Zeta" },
  { id: "T007", TeamName: "Team Eta" },
  { id: "T008", TeamName: "Team Theta" },
];

export default function RugbyMode({ teams }) {
  const [rugbyTeams, setRugbyTeams] = useState(FALLBACK_TEAMS);

  useEffect(() => {
    async function loadTeams() {
      try {
        const loaded = await loadRobotRugbyTeamsFromCSV(`/teams_monrobot.csv?t=${Date.now()}`);
        if (loaded && loaded.length > 0) {
          setRugbyTeams(loaded);
          console.log(`Loaded ${loaded.length} rugby teams from CSV`);
        }
      } catch (error) {
        console.error("Failed to load rugby teams from CSV:", error);
      }
    }
    loadTeams();
  }, []);

  const [stage, setStage] = useState("selection"); // "selection" or "running"
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [isGoldenGoal, setIsGoldenGoal] = useState(false);

  // Timer countdown
  useEffect(() => {
    let timer = null;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Check if scores are equal - enter golden goal
            if (score1 === score2) {
              setIsGoldenGoal(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

  const handleStartGame = () => {
    if (!team1 || !team2) {
      alert("Please select two teams!");
      return;
    }
    if (team1.id === team2.id) {
      alert("Please select two different teams!");
      return;
    }
    setStage("running");
    setScore1(0);
    setScore2(0);
    setTimeLeft(120);
    setIsRunning(false);
    setIsGoldenGoal(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Team Selection Stage
  if (stage === "selection") {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Select Two Teams for Rugby Match</h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Team 1 Selection */}
          <div>
            <h3 className="mb-3 text-lg font-bold text-gray-800">Team 1 (Side 1)</h3>
            <div className="border-2 border-blue-600 rounded-lg overflow-y-auto max-h-96 bg-white shadow">
              {rugbyTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setTeam1(team)}
                  className={`w-full px-4 py-3 text-left border-b border-gray-300 transition font-medium ${
                    team1?.id === team.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 hover:bg-blue-50"
                  }`}
                >
                  {team.TeamName}
                </button>
              ))}
            </div>
            {team1 && (
              <div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded text-blue-800 font-semibold">
                ✓ Selected: {team1.TeamName}
              </div>
            )}
          </div>

          {/* Team 2 Selection */}
          <div>
            <h3 className="mb-3 text-lg font-bold text-gray-800">Team 2 (Side 2)</h3>
            <div className="border-2 border-red-600 rounded-lg overflow-y-auto max-h-96 bg-white shadow">
              {rugbyTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setTeam2(team)}
                  className={`w-full px-4 py-3 text-left border-b border-gray-300 transition font-medium ${
                    team2?.id === team.id
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-800 hover:bg-red-50"
                  }`}
                >
                  {team.TeamName}
                </button>
              ))}
            </div>
            {team2 && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded text-red-800 font-semibold">
                ✓ Selected: {team2.TeamName}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition"
        >
          Start Match
        </button>
      </div>
    );
  }

  // Game Running Stage
  if (stage === "running") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-gray-900 to-black">
        {/* Header */}
        <div className="flex items-center justify-center bg-gray-900 px-8 py-6 text-white border-b-4 border-yellow-400 gap-8">
          <button
            onClick={() => {
              setStage("selection");
              setTeam1(null);
              setTeam2(null);
              setScore1(0);
              setScore2(0);
              setTimeLeft(180);
              setIsRunning(false);
              setIsGoldenGoal(false);
            }}
            className="absolute left-8 rounded bg-gray-700 px-6 py-3 font-bold text-lg hover:bg-gray-600"
          >
            ← Back
          </button>
          <div className="text-center">
            <div className="text-6xl font-bold font-mono">{formatTime(timeLeft)}</div>
            {isGoldenGoal && (
              <div className="text-xl font-bold text-yellow-300 mt-2 animate-pulse">🔥 GOLDEN GOAL 🔥</div>
            )}
          </div>
          <div className="absolute right-8 flex gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`rounded px-6 py-3 font-bold text-lg ${
                isRunning
                  ? "bg-red-700 hover:bg-red-800"
                  : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {isRunning ? "⏸ STOP" : "▶ START"}
            </button>
            <button
              onClick={() => setStage("selection")}
              className="rounded bg-purple-700 px-6 py-3 font-bold text-lg hover:bg-purple-800"
            >
              END MATCH
            </button>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="flex flex-1 flex-row">
          {/* Team 1 */}
          <div className="flex flex-1 flex-col items-center justify-center bg-blue-700 px-8 py-12">
            <h2 className="mb-8 text-5xl font-bold text-white">{team1?.TeamName}</h2>
            <div className="mb-12 text-9xl font-black text-white drop-shadow-lg">{score1}</div>
            <div className="flex gap-6 items-center">
              <button
                onClick={() => setScore1(Math.max(0, score1 - 1))}
                className="rounded-lg bg-red-500 px-6 py-3 text-3xl font-bold text-white hover:bg-red-600 active:bg-red-700 shadow-lg"
              >
                -1
              </button>
              <button
                onClick={() => setScore1(score1 + 1)}
                className="rounded-2xl bg-white px-16 py-12 text-7xl font-black text-blue-700 hover:bg-blue-50 active:bg-blue-200 shadow-2xl"
              >
                +1
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="w-4 bg-yellow-400"></div>

          {/* Team 2 */}
          <div className="flex flex-1 flex-col items-center justify-center bg-red-700 px-8 py-12">
            <h2 className="mb-8 text-5xl font-bold text-white">{team2?.TeamName}</h2>
            <div className="mb-12 text-9xl font-black text-white drop-shadow-lg">{score2}</div>
            <div className="flex gap-6 items-center">
              <button
                onClick={() => setScore2(Math.max(0, score2 - 1))}
                className="rounded-lg bg-red-500 px-6 py-3 text-3xl font-bold text-white hover:bg-red-600 active:bg-red-700 shadow-lg"
              >
                -1
              </button>
              <button
                onClick={() => setScore2(score2 + 1)}
                className="rounded-2xl bg-white px-16 py-12 text-7xl font-black text-red-700 hover:bg-red-50 active:bg-red-200 shadow-2xl"
              >
                +1
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}