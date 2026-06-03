
export default function Sidebar({
  page,
  setPage
}) {
  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          AI Parking
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          License Plate System
        </p>
      </div>

      <nav className="flex flex-col gap-3">

        <button
          onClick={() => setPage("camera")}
          className={`text-left px-4 py-3 rounded-2xl font-medium shadow transition ${
            page === "camera"
              ? "bg-black text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Camera
        </button>

        <button
          onClick={() => setPage("history")}
          className={`text-left px-4 py-3 rounded-2xl font-medium shadow transition ${
            page === "history"
              ? "bg-black text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Vehicle History
        </button>

      </nav>

      <div className="mt-auto">
        <div className="bg-gray-100 rounded-2xl p-4">

          <p className="text-sm text-gray-500">
            System Status
          </p>

          <div className="flex items-center gap-2 mt-2">

            <div className="w-3 h-3 rounded-full bg-green-500"></div>

            <span className="font-medium">
              Online
            </span>

          </div>

        </div>
      </div>

    </aside>
  )
}