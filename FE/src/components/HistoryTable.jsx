
export default function HistoryTable({
  history
}) {
  return (
    <table className="w-full border-collapse">

      <thead>
        <tr className="text-left border-b">
          <th className="pb-4">
            License Plate
          </th>

          <th className="pb-4">
            Time
          </th>

          <th className="pb-4">
            Status
          </th>
        </tr>
      </thead>

      <tbody>

        {history.map((item, index) => (
          <tr
            key={index}
            className="border-b hover:bg-gray-50 transition"
          >
            <td className="py-4 font-medium">
              {item.plate}
            </td>

            <td className="py-4">
              {item.time}
            </td>

            <td className="py-4">
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                Success
              </span>
            </td>
          </tr>
        ))}

      </tbody>

    </table>
  )
}