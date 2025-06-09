import os


class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:admin123@mongodb:27017/infodock")
    NBP_API_URL = "https://api.nbp.pl/api"
