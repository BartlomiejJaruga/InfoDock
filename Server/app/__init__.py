from flask import Flask
from .routes.currency import currency_bp
from .routes.weather import weather_bp
from .db.mongo import init_db
from dotenv import load_dotenv

load_dotenv()


def create_app():
    app = Flask(__name__)

    app.config.from_object('app.config.Config')

    init_db(app)

    app.register_blueprint(currency_bp, url_prefix='/api/currency')
    app.register_blueprint(weather_bp, url_prefix='/api/weather')

    return app
