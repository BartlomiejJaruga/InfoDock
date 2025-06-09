from flask import Flask
from .routes.currency import currency_bp
from .db.mongo import init_db
from dotenv import load_dotenv
from flask_cors import CORS
from .config import Config

load_dotenv()


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app, origins=["http://localhost:7666"])

    init_db(app)

    app.register_blueprint(currency_bp, url_prefix='/api/currency')

    return app
