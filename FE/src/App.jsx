// import { useState, useRef, useEffect } from 'react'

// export default function LicensePlateDashboard() {
//   const [page, setPage] = useState('camera')
//   const [resultImage, setResultImage] = useState(null)
//   const [mode, setMode] = useState("manual")
//   const [currentTime, setCurrentTime] = useState("")
//   const [search, setSearch] = useState("")
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)

//   const [plates, setPlates] = useState([])
//   const plateCacheRef = useRef({})
//   const prevFrame = useRef(null)

//   const [history, setHistory] = useState([])

//   const searchHistory = async (keyword) => {

//     if (keyword.trim() === "") {
//       fetchHistory()
//       return
//     }

//     const response = await fetch(
//       `http://127.0.0.1:8000/history/search?q=${keyword}`
//     )

//     const data = await response.json()

//     setHistory(data)
//   }

//   const fetchHistory = async () => {

//     const response = await fetch(
//       "http://127.0.0.1:8000/history"
//     )

//     const data = await response.json()

//     setHistory(data)
//   }


//   const hasMotion = (canvas) => {
//     const ctx = canvas.getContext("2d")
//     const current = ctx.getImageData(0, 0, canvas.width, canvas.height)

//     if (!prevFrame.current) {
//       prevFrame.current = current
//       return false
//     }

//     let diff = 0

//     for (let i = 0; i < current.data.length; i += 4) {
//       diff += Math.abs(current.data[i] - prevFrame.current.data[i])
//     }

//     prevFrame.current = current

//     return diff > 5_000_000
//   }


//   const captureImage = () => {
//     const video = videoRef.current
//     const canvas = canvasRef.current

//     if (!video || video.videoWidth === 0) {
//       console.log("Camera not ready")
//       return
//     }

//     canvas.width = video.videoWidth
//     canvas.height = video.videoHeight

//     const ctx = canvas.getContext("2d")
//     ctx.drawImage(video, 0, 0)

//     canvas.toBlob(async (blob) => {
//       if (!blob) {
//         console.log("Blob is null")
//         return
//       }

//       const file = new File([blob], "capture.jpg", {
//         type: "image/jpeg",
//       })

//       const formData = new FormData()
//       formData.append("file", file)

//       console.log("sending request...")

//       const response = await fetch("http://127.0.0.1:8000/upload", {
//         method: "POST",
//         body: formData,
//       })

//       console.log("response:", response)

//       const data = await response.json()

//       setPlates(Array.isArray(data.plate) ? data.plate : [])
//       setResultImage(data.result_image || null)
//       fetchHistory()
//    }, "image/jpeg")
//    }


//    const checkAndSend = async (canvas) => {
//     if (!hasMotion(canvas)) return

//     canvas.toBlob(async (blob) => {
//       if (!blob) return

//       const file = new File([blob], "auto.jpg", {
//         type: "image/jpeg",
//       })

//       const formData = new FormData()
//       formData.append("file", file)

//       const res = await fetch("http://127.0.0.1:8000/upload", {
//         method: "POST",
//         body: formData,
//       })

//       const data = await res.json()
//       const validPlates = []

//       for (const plate of (data.plate || [])) {

//         const now = Date.now()

//         if (
//           plateCacheRef.current[plate] &&
//           now - plateCacheRef.current[plate] < 6000
//         ) {
//           console.log("Duplicate:", plate)
//           continue
//         }

//         plateCacheRef.current[plate] = now

//         validPlates.push(plate)
//       }

//       Object.keys(plateCacheRef.current).forEach((plate) => {
//         if (Date.now() - plateCacheRef.current[plate] > 60000) {
//           delete plateCacheRef.current[plate]
//         }
//       })

//       if (validPlates.length === 0) {
//         return
//       }
//       setPlates(validPlates)
//       setResultImage(data.result_image || null)

//       fetchHistory()

//     }, "image/jpeg")
//   }


//   useEffect(() => {

//   const updateTime = () => {
//     const now = new Date()

//     const timeString = now.toLocaleTimeString("vi-VN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     })

//     setCurrentTime(timeString)
//   }

//   updateTime()

//   const interval = setInterval(updateTime, 1000)

//   return () => clearInterval(interval)

// }, [])


//  useEffect(() => {
//     if (page !== "camera") return

//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then(stream => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream
//         }
//       })
//       .catch(err => {
//         console.error("Camera error:", err)
//       })

//   }, [page])


//   useEffect(() => {
//     if (mode !== "auto") return

//     const interval = setInterval(() => {
//       const video = videoRef.current
//       const canvas = canvasRef.current

//       if (!video || video.videoWidth === 0) return

//       canvas.width = video.videoWidth
//       canvas.height = video.videoHeight

//       const ctx = canvas.getContext("2d")
//       ctx.drawImage(video, 0, 0)

//       checkAndSend(canvas)

//     }, 3000)

//     return () => clearInterval(interval)
//   }, [mode])


//   useEffect(() => {

//     const init = async () => {
//       await fetchHistory()
//     }

//     init()

//   }, [])


//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">AI Parking</h1>
//           <p className="text-sm text-gray-500 mt-1">License Plate System</p>
//         </div>

//         <nav className="flex flex-col gap-3">
//           <button
//             onClick={() => setPage('camera')}
//             className={`text-left px-4 py-3 rounded-2xl font-medium shadow transition ${
//               page === 'camera'
//                 ? 'bg-black text-white'
//                 : 'bg-white hover:bg-gray-100'
//             }`}
//           >
//             Camera
//           </button>

//           <button
//             onClick={() => setPage('history')}
//             className={`text-left px-4 py-3 rounded-2xl font-medium shadow transition ${
//               page === 'history'
//                 ? 'bg-black text-white'
//                 : 'bg-white hover:bg-gray-100'
//             }`}
//           >
//             Vehicle History
//           </button>

          
//         </nav>

//         <div className="mt-auto">
//           <div className="bg-gray-100 rounded-2xl p-4">
//             <p className="text-sm text-gray-500">System Status</p>
//             <div className="flex items-center gap-2 mt-2">
//               <div className="w-3 h-3 rounded-full bg-green-500"></div>
//               <span className="font-medium">Online</span>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-auto">
//         {page === 'camera' && (
//           <>
//             {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-800">
//               Camera Monitoring
//             </h2>
//             <p className="text-gray-500 mt-1">
//               AI License Plate Recognition System
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => setMode("manual")}
//               className={`px-5 py-3 rounded-2xl font-medium ${
//                 mode === "manual"
//                   ? "bg-white shadow-md"
//                   : "bg-gray-200"
//               }`}
//             >
//               Manual Mode
//             </button>

//             <button
//               onClick={() => setMode("auto")}
//               className={`px-5 py-3 rounded-2xl font-medium ${
//                 mode === "auto"
//                   ? "bg-green-500 text-white"
//                   : "bg-black text-white"
//               }`}
//             >
//               {mode === "auto" ? "AUTO ON" : "AUTO MODE"}
//             </button>
//           </div>
//         </div>

//         {/* Camera + Info */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Camera */}
//           <div className="lg:col-span-2 bg-white rounded-3xl shadow p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">Live Camera</h3>

//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
//                 <span className="text-sm font-medium">LIVE</span>
//               </div>
//             </div>

//             <div className="aspect-video bg-black rounded-2xl flex items-center justify-center overflow-hidden">

//               <video
//                 ref={videoRef}
//                 autoPlay
//                 className="w-full h-full object-cover rounded-2xl"
//               />
//               <canvas
//                 ref={canvasRef}
//                 style={{ display: "none" }}
//               />

//             </div>

//             <div className="mt-6 flex gap-4">
//               <button
//                 onClick={captureImage}
//                 disabled={mode !== "manual"}
//                 className={`px-6 py-3 rounded-2xl ${
//                   mode !== "manual"
//                     ? "bg-gray-300 cursor-not-allowed"
//                     : "bg-black text-white"
//                 }`}
//               >
//                 Capture Image
//               </button>
//             </div>
//           </div>

//           {/* Plate Info */}
//           <div className="bg-white rounded-3xl shadow p-6 flex flex-col gap-6">
//             <div>
//               <h3 className="text-xl font-semibold mb-4">
//                 Latest Detection
//               </h3>

//               <div className="bg-gray-100 rounded-2xl p-4">
//                 <p className="text-sm text-gray-500">License Plate</p>
//                 <div className="mt-2 flex flex-col gap-2">

//                   {plates.length > 0 ? (
//                     plates.map((plate, index) => (
//                       <h2
//                         key={index}
//                         className="text-2xl font-bold tracking-widest"
//                       >
//                         {plate}
//                       </h2>
//                     ))
//                   ) : (
//                     <h2 className="text-2xl font-bold tracking-widest">
//                       No Plate
//                     </h2>
//                   )}

//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gray-100 rounded-2xl p-4">
//                 <p className="text-sm text-gray-500">Time</p>
//                 <h4 className="font-bold mt-2">{currentTime}</h4>
//               </div>

//               <div className="bg-gray-100 rounded-2xl p-4">
//                 <p className="text-sm text-gray-500">Status</p>
//                 <h4 className="font-bold mt-2 text-green-600">
//                   Detected
//                 </h4>
//               </div>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500 mb-3">Captured Image</p>

//               {resultImage ? (
//                   <img
//                     src={resultImage}
//                     className="w-full h-full object-cover rounded-2xl"
//                   />
//                 ) : (
//                   <div className="h-48 flex items-center justify-center text-gray-500">
//                     Vehicle Snapshot
//                   </div>
//                 )}
//             </div>
//           </div>
//         </div>
//           </>
//         )}

//         {page === 'history' && (
//           <div>
//             <div className="flex justify-between items-center mb-8">
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-800">
//                   Vehicle History
//                 </h2>
//                 <p className="text-gray-500 mt-1">
//                   All detected license plates
//                 </p>
//               </div>
//             </div>

//             <div className="bg-white rounded-3xl shadow p-6 overflow-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-xl font-semibold">Detection History</h3>

//                 <input
//                   type="text"
//                   placeholder="Search plate..."
//                   value={search}
//                   onChange={(e) => {

//                     const value = e.target.value

//                     setSearch(value)

//                     searchHistory(value)

//                   }}
//                   className="px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-black"
//                 />
//               </div>

//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="text-left border-b">
//                     <th className="pb-4">License Plate</th>
//                     <th className="pb-4">Time</th>
//                     <th className="pb-4">Status</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {history.map((item, index) => (
//                     <tr key={index} className="border-b hover:bg-gray-50 transition">
//                       <td className="py-4 font-medium">{item.plate}</td>
//                       <td className="py-4">{item.time}</td>
//                       <td className="py-4">
//                         <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
//                           Success
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }


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