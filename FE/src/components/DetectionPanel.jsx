// src/components/DetectionPanel.jsx

export default function DetectionPanel({
  plates,
  resultImage,
  currentTime
}) {
  return (
    <div className="bg-white rounded-3xl shadow p-6 flex flex-col gap-6">

      <div>
        <h3 className="text-xl font-semibold mb-4">
          Latest Detection
        </h3>

        <div className="bg-gray-100 rounded-2xl p-4">
          <p className="text-sm text-gray-500">
            License Plate
          </p>

          <div className="mt-2 flex flex-col gap-2">

            {plates.length > 0 ? (
              plates.map((plate, index) => (
                <h2
                  key={index}
                  className="text-2xl font-bold tracking-widest"
                >
                  {plate}
                </h2>
              ))
            ) : (
              <h2 className="text-2xl font-bold tracking-widest">
                No Plate
              </h2>
            )}

           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-gray-100 rounded-2xl p-4">
          <p className="text-sm text-gray-500">
            Time
          </p>

          <h4 className="font-bold mt-2">
            {currentTime}
          </h4>
        </div>

        <div className="bg-gray-100 rounded-2xl p-4">
          <p className="text-sm text-gray-500">
            Status
          </p>

          <h4 className="font-bold mt-2 text-green-600">
            {plates.length > 0
              ? "Detected"
              : "Waiting"}
          </h4>
        </div>

      </div>


      <div>

        <p className="text-sm text-gray-500 mb-3">
          Captured Image
        </p>

        <div className="h-48 bg-gray-100 rounded-2xl overflow-hidden">

          {resultImage ? (
            <img
              src={resultImage}
              alt="Detected Vehicle"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Vehicle Snapshot
            </div>
          )}

        </div>

      </div>

    </div>
  )
}