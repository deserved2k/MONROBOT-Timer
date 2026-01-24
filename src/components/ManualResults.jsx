export default function ManualResults({ manualResults, onClearManual }) {
  const parseTimeToMs = (timeString) => {
    const parts = timeString.split(':');
    const minutes = parseInt(parts[0]) || 0;
    const secondsCentiseconds = (parts[1] || '0').split('.');
    const seconds = parseInt(secondsCentiseconds[0]) || 0;
    const centiseconds = parseInt(secondsCentiseconds[1]) || 0;
    return minutes * 60000 + seconds * 1000 + centiseconds * 10;
  };
  const sortedResults = [...manualResults].sort((a, b) => {
    const timeA = parseTimeToMs(a.timeString);
    const timeB = parseTimeToMs(b.timeString);
    return timeA - timeB;
  });

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 flex justify-center">Manual Mode Results (TDRC)</h3>
          {manualResults.length > 0 && (
            <button
              onClick={onClearManual}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-semibold"
            >
              Clear
            </button>
          )}
        </div>
        {manualResults.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse bg-white text-sm">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Team</th>
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
                      {result.teamName}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-center text-gray-800 font-semibold">
                      {result.timeString}
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
