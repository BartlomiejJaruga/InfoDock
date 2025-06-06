from flask import Blueprint, jsonify, request
from ..services.weather_service import get_weather

weather_bp = Blueprint('weather', __name__)


@weather_bp.route('/', methods=['GET'])
def weather():
    city = request.args.get('city', 'Warsaw')
    data = get_weather(city)
    return jsonify(data)
