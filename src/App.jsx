import { useState, useEffect } from "react";
import AutomaticMode from "./components/AutomaticMode";
import ManualMode from "./components/ManualMode";
import RugbyMode from "./components/RugbyMode";
import ManualResults from "./components/ManualResults";
import AutomaticResults from "./components/AutomaticResults";
import { loadDroneTeamsFromCSV } from "./utils/csvParser";
import { 
  saveManualResult,
  subscribeToManualResults,
  clearAllManualResults,
  saveAutomaticResult,
  subscribeToAutomaticResults,
  clearAllAutomaticResults
} from "./utils/firebase";

export default function App() {
  const [mode, setMode] = useState("manual"); 
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [manualResults, setManualResults] = useState([]);
  const [automaticResults, setAutomaticResults] = useState([]);

  useEffect(() => {
    async function loadTeams() {
      try {
        setLoadingTeams(true);
        const droneTeams = await loadDroneTeamsFromCSV(`/teams_monrobot.csv?t=${Date.now()}`);
        setTeams(droneTeams);
        console.log(`Loaded ${droneTeams.length} Drone teams from CSV`);
      } catch (error) {
        console.error('Failed to load teams from CSV:', error);
        setTeams([
          { id: "T001", name: "Team Alpha" },
          { id: "T002", name: "Team Beta" },
          { id: "T003", name: "Team Gamma" }
        ]);
      } finally {
        setLoadingTeams(false);
      }
    }

    loadTeams();

    return () => {};
  }, []);

  useEffect(() => {
    // Subscribe to manual results in real-time
    const unsubscribeManual = subscribeToManualResults((results) => {
      setManualResults(results);
    });

    // Subscribe to automatic results in real-time
    const unsubscribeAutomatic = subscribeToAutomaticResults((results) => {
      setAutomaticResults(results);
    });

    return () => {
      unsubscribeManual();
      unsubscribeAutomatic();
    };
  }, []);

  const handleSaveManual = async (result) => {
    try {
      await saveManualResult(result);
    } catch (error) {
      console.error("Failed to save manual result:", error);
      alert("Failed to save result. Please try again.");
    }
  };

  const handleSaveAutomatic = async (result) => {
    try {
      await saveAutomaticResult(result);
    } catch (error) {
      console.error("Failed to save automatic result:", error);
      alert("Failed to save result. Please try again.");
    }
  };

  const handleClearManualResults = async () => {
    if (window.confirm("Are you sure you want to clear all manual mode results?")) {
      try {
        await clearAllManualResults();
      } catch (error) {
        console.error("Failed to clear manual results:", error);
      }
    }
  };

  const handleClearAutomaticResults = async () => {
    if (window.confirm("Are you sure you want to clear all automatic mode results?")) {
      try {
        await clearAllAutomaticResults();
      } catch (error) {
        console.error("Failed to clear automatic results:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 shadow">
      <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-6 shadow">
        <div className="flex justify-center gap-10 w-full">        
          <Tab active={mode === "manual"} onClick={() => setMode("manual")}>
          Manual
        </Tab>
        <Tab active={mode === "automatic"} onClick={() => setMode("automatic")}>
          Automatic
        </Tab>
        <Tab active={mode === "manualresults"} onClick={() => setMode("manualresults")}>
          Manual Results
        </Tab>
        <Tab active={mode === "automaticresults"} onClick={() => setMode("automaticresults")}>
          Automatic Results
        </Tab>
        <Tab active={mode === "rugbymode"} onClick={() => setMode("rugbymode")}>
          Rugby Mode
        </Tab>
        </div>
        {loadingTeams && (
          <div className="mt-4 text-center text-gray-600">
            Loading teams from CSV...
          </div>
        )}
      </div>

      {!loadingTeams && mode === "manual" && <ManualMode teams={teams} onSaveResult={handleSaveManual} />}
      {!loadingTeams && mode === "automatic" && <AutomaticMode teams={teams} onSaveResult={handleSaveAutomatic} />}
      {!loadingTeams && mode === "manualresults" && <ManualResults manualResults={manualResults} automaticResults={automaticResults} onClearManual={handleClearManualResults} onClearAutomatic={handleClearAutomaticResults} />}
      {!loadingTeams && mode === "automaticresults" && <AutomaticResults automaticResults={automaticResults} onClearAutomatic={handleClearAutomaticResults} />}
      {mode === "rugbymode" && <RugbyMode teams={teams} />}
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex-1 rounded-lg px-6 py-3 text-base font-semibold transition",  // flex-1 + more padding
        active
          ? "bg-indigo-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}