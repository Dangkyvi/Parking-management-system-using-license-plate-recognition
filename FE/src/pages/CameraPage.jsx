// src/pages/CameraPage.jsx

import { useState, useRef, useEffect } from "react"
import CameraView from "../components/CameraView"
import DetectionPanel from "../components/DetectionPanel"
import useCamera from "../hooks/useCamera"
import useCurrentTime from "../hooks/useCurrentTime"
import { uploadImage } from "../services/api"

export default function CameraPage() {
  const [plates, setPlates] = useState([])
  const [resultImage, setResultImage] = useState(null)
  const [mode, setMode] = useState("manual")

  const { videoRef } = useCamera()
  const canvasRef = useRef(null)

  const plateCacheRef = useRef({})
  const prevFrame = useRef(null)

  const currentTime = useCurrentTime()

  const hasMotion = (canvas) => {
    const ctx = canvas.getContext("2d")
    const current = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    )

    if (!prevFrame.current) {
      prevFrame.current = current
      return false
    }

    let diff = 0

    for (let i = 0; i < current.data.length; i += 4) {
      diff += Math.abs(
        current.data[i] -
        prevFrame.current.data[i]
      )
    }

    prevFrame.current = current

    return diff > 5_000_000
  }

  const captureImage = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || video.videoWidth === 0) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0)

    canvas.toBlob(async (blob) => {
      if (!blob) return

      const file = new File(
        [blob],
        "capture.jpg",
        {
          type: "image/jpeg"
        }
      )

      const formData = new FormData()
      formData.append("file", file)

      const data = await uploadImage(formData)

      setPlates(
        Array.isArray(data.plate)
          ? data.plate
          : []
      )

      setResultImage(
        data.result_image || null
      )
    }, "image/jpeg")
  }

  const checkAndSend = (canvas) => {
    if (!hasMotion(canvas)) return

    canvas.toBlob(async (blob) => {
      if (!blob) return

      const file = new File(
        [blob],
        "auto.jpg",
        {
          type: "image/jpeg"
        }
      )

      const formData = new FormData()
      formData.append("file", file)

      const data = await uploadImage(formData)

      const validPlates = []

      for (const plate of (data.plate || [])) {
        const now = Date.now()

        if (
          plateCacheRef.current[plate] &&
          now - plateCacheRef.current[plate] < 6000
        ) {
          continue
        }

        plateCacheRef.current[plate] = now

        validPlates.push(plate)
      }

      Object.keys(
        plateCacheRef.current
      ).forEach((plate) => {

        if (
          Date.now() -
          plateCacheRef.current[plate] >
          60000
        ) {
          delete plateCacheRef.current[plate]
        }

      })

      if (validPlates.length === 0)
        return

      setPlates(validPlates)

      setResultImage(
        data.result_image || null
      )
    }, "image/jpeg")
  }

  useEffect(() => {

    if (mode !== "auto") return

    const interval = setInterval(() => {

      const video =
        videoRef.current

      const canvas =
        canvasRef.current

      if (
        !video ||
        video.videoWidth === 0
      ) {
        return
      }

      canvas.width =
        video.videoWidth

      canvas.height =
        video.videoHeight

      const ctx =
        canvas.getContext("2d")

      ctx.drawImage(
        video,
        0,
        0
      )

      checkAndSend(canvas)

    }, 3000)

    return () =>
      clearInterval(interval)

  }, [mode])

  return (
    <>

      <div className="flex justify-between items-center mb-8">

        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Camera Monitoring
          </h2>

          <p className="text-gray-500 mt-1">
            AI License Plate Recognition System
          </p>
        </div>

        <div className="flex gap-4">

          <button
            onClick={() =>
              setMode("manual")
            }
            className={`px-5 py-3 rounded-2xl font-medium ${
              mode === "manual"
                ? "bg-white shadow-md"
                : "bg-gray-200"
            }`}
          >
            Manual Mode
          </button>

          <button
            onClick={() =>
              setMode("auto")
            }
            className={`px-5 py-3 rounded-2xl font-medium ${
              mode === "auto"
                ? "bg-green-500 text-white"
                : "bg-black text-white"
            }`}
          >
            {mode === "auto"
              ? "AUTO ON"
              : "AUTO MODE"}
          </button>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <CameraView
          videoRef={videoRef}
          canvasRef={canvasRef}
          captureImage={captureImage}
          mode={mode}
        />

        <DetectionPanel
          plates={plates}
          resultImage={resultImage}
          currentTime={currentTime}
        />

      </div>
    </>
  )
}