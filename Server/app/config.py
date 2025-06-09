import os


class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:admin123@mongodb:27017/infodock")
    WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "your-weather-api-key")
    WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather"
    NBP_API_URL = "https://api.nbp.pl/api"
