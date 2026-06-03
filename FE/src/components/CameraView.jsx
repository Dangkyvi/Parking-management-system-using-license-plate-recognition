
export default function CameraView({
  videoRef,
  canvasRef,
  captureImage,
  mode
}) {
  return (
    <div className="lg:col-span-2 bg-white rounded-3xl shadow p-6">

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Live Camera
        </h3>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>

          <span className="text-sm font-medium">
            LIVE
          </span>
        </div>
      </div>


      <div className="aspect-video bg-black rounded-2xl flex items-center justify-center overflow-hidden">

        <video
          ref={videoRef}
          autoPlay
          className="w-full h-full object-cover rounded-2xl"
        />

        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
        />

      </div>


      <div className="mt-6 flex gap-4">

        <button
          onClick={captureImage}
          disabled={mode !== "manual"}
          className={`px-6 py-3 rounded-2xl 
            transition-all duration-150
            active:scale-95
            ${
            mode !== "manual"
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
          Capture Image
        </button>

      </div>

    </div>
  )
}