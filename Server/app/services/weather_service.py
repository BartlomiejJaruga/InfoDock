import requests
from flask import current_app


def get_weather(city="Warsaw"):
    api_key = current_app.config['WEATHER_API_KEY']
    url = current_app.config['WEATHER_API_URL']
    params = {
        'q': city,
        'appid': api_key,
        'units': 'metric'
    }
    response = requests.get(url, params=params)
    if response.ok:
        return response.json()
    return {"error": "City not found"}
