import React, { useEffect, useState, useMemo } from "react";
import "../index.css";

export default function ManualMode({ teams, onSaveResult }) {
    const manualDroneTeams = useMemo(() => {
        return teams.filter(team => team.id && team.id.startsWith('TDRC'));
    }, [teams]);

    const [elapsedTime, setElapsedTime] = useState(0); 
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [selectedTeam, setSelectedTeam] = useState("");

    useEffect(() => {
        let timer = null;

        if (isRunning) {
            const start = Date.now() - elapsedTime;
            setStartTime(start);
            timer = setInterval(() => {
                setElapsedTime(Date.now() - start);
            }, 10); 
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isRunning]);

    const handleStartStop = () => {
        if (isRunning) {
            setIsRunning(false);
        } else {
            if (!selectedTeam) {
                alert("Please select a team first!");
                return;
            }
            setIsRunning(true);
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setElapsedTime(0);
        setStartTime(0);
    };

    const handleSaveResult = () => {
        if (elapsedTime === 0) {
            alert("No time recorded!");
            return;
        }

        const team = manualDroneTeams.find(t => t.id === selectedTeam);
        if (team) {
            const formattedTime = formatTime(elapsedTime);
            onSaveResult({
                teamId: selectedTeam,
                teamName: team.name,
                time: elapsedTime,
                timeString: `${formattedTime.time}.${formattedTime.centiseconds}`
            });
            alert(`Saved: ${team.name} - ${formattedTime.time}.${formattedTime.centiseconds}`);
            handleReset();
            setSelectedTeam("");
        }
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const centiseconds = Math.floor((ms % 1000) / 10);

        return {
            time: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
            centiseconds: String(centiseconds).padStart(2, '0')
        };
    };

    const formatted = formatTime(elapsedTime);
    const selectedTeamData = manualDroneTeams.find(t => t.id === selectedTeam);

    return (
        <>
            <div className="max-w-3xl rounded-2xl bg-white p-6 shadow mx-auto mt-10">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    Manual Mode (5 Laps)
                </h2>
                <div className="mb-6">
                    <label className="block mb-3 text-sm font-medium text-gray-700">
                        Select a Team
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2">
                        {manualDroneTeams.map((team) => (
                            <button
                                key={team.id}
                                onClick={() => !isRunning && setSelectedTeam(team.id)}
                                disabled={isRunning}
                                className={`
                                    p-3 rounded-lg text-left transition-all
                                    ${selectedTeam === team.id
                                        ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400 ring-offset-2'
                                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800'
                                    }
                                    ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
                                `}
                            >
                                <div className="text-xs font-semibold mb-1 opacity-80">
                                    {team.id}
                                </div>
                                <div className="text-sm font-medium truncate">
                                    {team.name}
                                </div>
                            </button>
                        ))}
                    </div>
                    {selectedTeam && (
                        <div className="mt-3 text-sm text-gray-600">
                            Selected: <span className="font-semibold">{selectedTeamData?.name}</span> ({selectedTeam})
                        </div>
                    )}
                </div>
                {!isRunning && (
                  <>
                    <div className="mb-6 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                      <div className="text-center">
                        <div className="text-5xl font-mono font-bold tabular-nums">
                          {formatted.time}
                        </div>
                        <div className="text-2xl font-mono opacity-80 mt-2">
                          .{formatted.centiseconds}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={handleStartStop}
                        disabled={!selectedTeam && !isRunning}
                        className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white transition
                        ${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                        disabled:bg-gray-300 disabled:cursor-not-allowed`}
                      >
                        {isRunning ? "Stop" : "Start"}
                      </button>
                      <button onClick={handleReset} className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300 transition">
                        Reset
                      </button>
                    </div>
                    <button
                      onClick={handleSaveResult}
                      disabled={isRunning || elapsedTime === 0 || !selectedTeam}
                      className="w-full rounded-lg px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Save Result
                    </button>
                  </>
                )}
            </div>
            {isRunning && (
              <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  {selectedTeamData && (
                    <div className="mb-8 text-center">
                      <div className="text-2xl font-semibold text-white mb-2">
                        {selectedTeamData.name}
                      </div>
                      <div className="text-lg text-gray-300">
                        {selectedTeamData.id}
                      </div>
                    </div>
                  )}
                  <div className="mb-12 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-9xl md:text-[12rem] font-mono font-bold tabular-nums text-white drop-shadow-2xl">
                        {formatted.time}
                      </div>
                      <div className="text-5xl md:text-7xl font-mono opacity-90 mt-4 text-white drop-shadow-2xl">
                        .{formatted.centiseconds}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-6 w-full max-w-2xl px-8">
                    <button
                      onClick={handleStartStop}
                      className="flex-1 rounded-xl px-8 py-6 text-3xl font-bold text-white transition bg-red-500 hover:bg-red-600 shadow-2xl hover:shadow-red-500/50"
                    >
                      Stop
                    </button>
              
                    <button
                      onClick={handleReset}
                      className="flex-1 rounded-xl px-8 py-6 text-3xl font-bold text-gray-800 bg-gray-200 hover:bg-gray-300 transition shadow-2xl"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
        </>
    );
}
