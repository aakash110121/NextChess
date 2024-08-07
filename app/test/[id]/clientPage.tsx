"use client";
import TestingChart from "@/components/TestingChart";

export default function ClientPage({ gamesDataList }: any) {
  return (
    <div>
      <div className="flex flex-col gap-y-4 px-2">
        {gamesDataList.map((game: any, tableIndex: number) => (
          <div key={tableIndex} className="overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transcr Create Lat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Msg Create Lat{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Run Create Lat{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Run Exec Lat{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stockfish Move Lat{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message Retrieve Lat{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Overall Lat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FEN Before/After
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {game.cost_array.map((cost: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {game.transcript_create_lat_array[index]}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {game.message_create_lat_array[index]}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {game.run_create_lat_array[index]}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {game.run_exec_lat_array[index]}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {game.stockfish_move_lat_array[index]}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {game.message_retrieve_lat_array[index]}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {game.overall_lat_array[index]}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {cost}$
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {game.response_array[index]}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {game.fen_before_array[index]} {game.fen_after_array[index]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-black/80">
              Overall cost: {game.overall_cost.toFixed(4)}
              $
            </div>
            <div className="text-black/80">
              Avg cost per move: {game.avg_cost}$
            </div>
            <div className="text-black/80">
              Avg latency per move: {game.avg_latency}ms
            </div>
            <div className="w-full max-w-[1700px] grid grid-rows-4 grid-cols-1 md:grid-rows-2 md:grid-cols-2 lg:grid-rows-1 lg:grid-cols-4">
              <TestingChart
                data={game.message_create_lat_array}
                chartTitle={"Message Latency Through Moves"}
                titleX={"Move number"}
                titleY={"Latency (ms)"}
              />
              <TestingChart
                data={game.cost_array}
                chartTitle={"Message Cost Through Moves"}
                titleX={"Move number"}
                titleY={"Cost ($)"}
              />
              <TestingChart
                data={game.run_exec_lat_array}
                chartTitle={"Run Exec Latency Through Moves"}
                titleX={"Move number"}
                titleY={"Latency (ms)"}
              />
              <TestingChart
                data={game.overall_lat_array}
                chartTitle={"Overall Latency Through Moves"}
                titleX={"Move number"}
                titleY={"Latency (ms)"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
