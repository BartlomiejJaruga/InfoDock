import requests
from flask import current_app


def get_currency_rate(code="USD"):
    url = f"{current_app.config['NBP_API_URL']}/exchangerates/rates/A/{code}/?format=json"
    response = requests.get(url)
    if response.ok:
        return response.json()
    return {"error": "Currency not found"}


def get_currency_rate_from_range(start_date, end_date, code="USD"):
    url = f"{current_app.config['NBP_API_URL']}/exchangerates/rates/A/{code}/{start_date}/{end_date}/?format=json"
    response = requests.get(url)
    if response.ok:
        return response.json()
    return {"error": "Currency not found"}


def get_currency_codes():
    table_name = "A"
    url = f"{current_app.config['NBP_API_URL']}/exchangerates/tables/{table_name}/?format=json"
    response = requests.get(url)
    if response.ok:
        return response.json()
    return {"error": f"incorrect currency table name: {table_name}"}


def get_currency_gold_price():
    url = f"{current_app.config['NBP_API_URL']}/cenyzlota/?format=json"
    response = requests.get(url)
    if response.ok:
        return response.json()
    return {"error": "unable to get current gold price"}


def get_currency_gold_price_from_range(start_date, end_date):
    url = f"{current_app.config['NBP_API_URL']}/cenyzlota/{start_date}/{end_date}/?format=json"
    response = requests.get(url)
    if response.ok:
        return response.json()
    return {"error": "unable to get gold price from selected date range"}
