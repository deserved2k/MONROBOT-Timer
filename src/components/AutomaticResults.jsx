export default function AutomaticResults({ automaticResults, onClearAutomatic }) {
  // Convert milliseconds to readable format (mm:ss.cs) and parse for sorting
  const parseTimeToMs = (timeString) => {
    if (!timeString) return Infinity;
    // If it's already in milliseconds format (numeric)
    const ms = parseInt(timeString);
    return isNaN(ms) ? Infinity : ms;
  };

  const formatTimeFromMs = (timeString) => {
    const ms = parseInt(timeString);
    if (isNaN(ms)) return timeString;
    
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Sort by laps (highest to lowest), then by time (lowest to highest) for same lap count
  const sortedResults = [...automaticResults].sort((a, b) => {
    if (a.lapCount !== b.lapCount) {
      return b.lapCount - a.lapCount; // Higher lap count comes first
    }
    // If lap counts are equal, sort by time (fastest first)
    const timeA = parseTimeToMs(a.timeString);
    const timeB = parseTimeToMs(b.timeString);
    return timeA - timeB;
  });

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800">Automatic Mode Results (TDRA)</h3>
          {automaticResults.length > 0 && (
            <button
              onClick={onClearAutomatic}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-semibold"
            >
              Clear
            </button>
          )}
        </div>
        {automaticResults.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse bg-white text-sm">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="border border-gray-300 px-2 py-1 text-left font-semibold">TeamID</th>
                  <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Team</th>
                  <th className="border border-gray-300 px-2 py-1 text-center font-semibold">Laps</th>
                  <th className="border border-gray-300 px-2 py-1 text-center font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border border-gray-300 px-2 py-1 text-gray-800">
                      {result.teamId}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-gray-800">
                      {result.teamName}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center text-gray-800 font-semibold">
                      {result.lapCount}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center text-gray-800 font-semibold">
                      {formatTimeFromMs(result.timeString)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-100 p-3 text-center text-xs text-gray-600">
            No results yet
          </div>
        )}
      </div>
    </div>
  );
}

