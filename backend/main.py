from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import Query
from datetime import datetime, timedelta
import shutil
import uuid
import os
import cv2
import glob
from pipeline import process_image
from database import db
from database import history_collection
from datetime import datetime

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
UPLOAD_FOLDER = "uploads"

app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name=UPLOAD_FOLDER)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def home():
    return {"message": "Backend is running"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    unique_name = f"{uuid.uuid4()}.jpg"

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_name
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = cv2.imread(file_path)

    result_image, plate_list = process_image(image)

    os.remove(file_path)

    valid_plates = []
    for plate in plate_list:

        plate = plate.strip()

        if len(plate) >= 6:
            valid_plates.append(plate)

    if len(valid_plates) == 0:
        return {
            "plate": [],
            "result_image": None
        }


    result_name = f"result_{uuid.uuid4()}.jpg"

    result_path = os.path.join(
        UPLOAD_FOLDER,
        result_name
    )
    for plate in valid_plates:

        now = datetime.now()

        latest = history_collection.find_one(
            {"plate": plate},
            sort=[("time", -1)]
        )

        allow_insert = True

        if latest:

            latest_time = datetime.strptime(
                latest["time"],
                "%Y-%m-%d %H:%M:%S"
            )

            diff = (now - latest_time).total_seconds()

            if diff < 60:
                allow_insert = False

        if allow_insert:
            history_collection.insert_one({
                "plate": plate,
                "time": now.strftime("%Y-%m-%d %H:%M:%S"),
                "image": f"http://127.0.0.1:8000/{result_path}",
            })

            cv2.imwrite(
                result_path,
                result_image
            )
    files = glob.glob(f"{UPLOAD_FOLDER}/*")

    if len(files) > 1000:
        oldest_file = min(files, key=os.path.getctime)

        os.remove(oldest_file)

        print(f"Deleted: {oldest_file}")

    return {
        "plate": valid_plates,
        "result_image": f"http://127.0.0.1:8000/{result_path}"
    }
@app.get("/history")
def get_history():

    data = list(
        history_collection.find(
            {},
            {"_id": 0}
        ).sort("time", -1)
    )

    return data

@app.get("/history/search")
def search_history(q: str = Query("")):

    data = list(
        history_collection.find(
            {
                "plate": {
                    "$regex": q,
                    "$options": "i"
                }
            },
            {"_id": 0}
        ).sort("time", -1)
    )

    return data