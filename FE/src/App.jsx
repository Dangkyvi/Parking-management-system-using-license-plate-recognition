
import { useState } from "react"

import Sidebar from "./components/Sidebar"

import CameraPage from "./pages/CameraPage"
import HistoryPage from "./pages/HistoryPage"

export default function App() {
  const [page, setPage] = useState("camera")

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <Sidebar
        page={page}
        setPage={setPage}
      />

      <main className="flex-1 p-8 overflow-auto">

        {page === "camera" && (
          <CameraPage />
        )}

        {page === "history" && (
          <HistoryPage />
        )}

      </main>

    </div>
  )
}