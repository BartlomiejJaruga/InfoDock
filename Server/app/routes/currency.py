from flask import Blueprint, jsonify, request
from ..services import currency_service
from datetime import date, datetime, timedelta

currency_bp = Blueprint('currency', __name__)


@currency_bp.route('/', methods=['GET'])
def get_rate():
    code = request.args.get('code', 'USD')
    data = currency_service.get_currency_rate(code)
    return jsonify(data)


@currency_bp.route('/range/', methods=['GET'])
def get_rate_range():
    code = request.args.get('code', 'USD')
    start_date = request.args.get('startDate', (date.today() - timedelta(days=30)).isoformat())
    end_date = request.args.get('endDate', date.today().isoformat())

    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date().isoformat()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date().isoformat()
    except (ValueError, TypeError):
        return jsonify({"error": "Dates must be in YYYY-MM-DD format"}), 400

    data = currency_service.get_currency_rate_from_range(start_date, end_date, code)
    return jsonify(data)


@currency_bp.route('/codes/', methods=['GET'])
def get_currency_codes():
    data = currency_service.get_currency_codes()
    codes = [rate["code"] for rate in data[0]["rates"]]

    return jsonify(codes)


@currency_bp.route('/gold/', methods=['GET'])
def get_currency_gold_price():
    data = currency_service.get_currency_gold_price()
    return jsonify(data)


@currency_bp.route('/gold/range/', methods=['GET'])
def get_currency_gold_price_from_range():
    start_date = request.args.get('startDate', (date.today() - timedelta(days=30)).isoformat())
    end_date = request.args.get('endDate', date.today().isoformat())

    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date().isoformat()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date().isoformat()
    except (ValueError, TypeError):
        return jsonify({"error": "Dates must be in YYYY-MM-DD format"}), 400

    data = currency_service.get_currency_gold_price_from_range(start_date, end_date)
    return jsonify(data)
