from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["parking_system"]

history_collection = db["vehicle_history"]