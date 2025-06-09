from flask import Blueprint, jsonify, request
from ..services import currency_service
from datetime import date, datetime, timedelta
from ..db.mongo import mongo

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


@currency_bp.route('/currency-history/save/', methods=['POST'])
def save_currency_rates():
    data = request.json

    code = data.get("code")
    rates = data.get("rates")

    if not code or not isinstance(rates, list):
        return jsonify({"error": "Invalid payload"}), 400

    collection = mongo.db.currency_history

    collection.insert_one({
        "code": code,
        "rates": rates
    })

    return jsonify({"status": "saved"}), 201


@currency_bp.route("/currency-history/", methods=["GET"])
def get_all_currency_history():
    collection = mongo.db.currency_history

    entries = list(collection.find({}, {"_id": 0}))

    print(entries)

    return jsonify(entries), 200


@currency_bp.route("/currency-history/delete-all/", methods=["DELETE"])
def delete_all_currency_history():
    collection = mongo.db.currency_history

    result = collection.delete_many({})

    return jsonify({
        "message": "All currency history entries deleted.",
        "deleted_count": result.deleted_count
    }), 200
