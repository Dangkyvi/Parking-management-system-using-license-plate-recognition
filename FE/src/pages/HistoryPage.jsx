
import { useEffect, useState } from "react"
import HistoryTable from "../components/HistoryTable"
import {
  getHistory,
  searchHistory
} from "../services/api"

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [search, setSearch] = useState("")

  const fetchHistory = async () => {
    try {
      const data = await getHistory()
      setHistory(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSearch = async (keyword) => {
    setSearch(keyword)

    try {
      if (keyword.trim() === "") {
        fetchHistory()
        return
      }

      const data = await searchHistory(keyword)
      setHistory(data)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Vehicle History
          </h2>

          <p className="text-gray-500 mt-1">
            All detected license plates
          </p>
        </div>
      </div>


      <div className="bg-white rounded-3xl shadow p-6 overflow-auto">

        <div className="flex justify-between items-center mb-6">

          <h3 className="text-xl font-semibold">
            Detection History
          </h3>

          <input
            type="text"
            placeholder="Search plate..."
            value={search}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            className="px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-black"
          />

        </div>

        <HistoryTable history={history} />

      </div>
    </div>
  )
}