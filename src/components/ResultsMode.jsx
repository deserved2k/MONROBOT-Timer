export default function ResultsMode({ manualResults, automaticResults, onClearManual, onClearAutomatic }) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-800">Manual Mode (TDRC)</h3>
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
                  {manualResults.map((result, index) => (
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
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-800">Automatic Mode (TDRA)</h3>
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
                    <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Team</th>
                    <th className="border border-gray-300 px-2 py-1 text-center font-semibold">Laps</th>
                  </tr>
                </thead>
                <tbody>
                  {automaticResults.map((result, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="border border-gray-300 px-2 py-1 text-gray-800">
                        {result.teamName}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center text-gray-800 font-semibold">
                        {result.lapCount}
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
    </div>
  );
}