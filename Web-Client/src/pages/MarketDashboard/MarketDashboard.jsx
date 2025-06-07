import styles from "./MarketDashboard.module.scss";

import { useEffect, useState } from "react";
import axiosInstance from "@services/axiosInstance";

export default function MarketDashboard() {
    const [currencyCodes, setCurrencyCodes] = useState([]);
    const [loadingCurrencyCodes, setLoadingCurrencyCodes] = useState(true);
    const [formData, setFormData] = useState({
        currency: "",
        startDate: null,
        endDate: null,
    })
    const [currencyData, setCurrencyData] = useState({});
    const [isCurrencyDataLoaded, setIsCurrencyDataLoaded] = useState(false);

    useEffect(() => {
        const cachedCurrencyCodes = sessionStorage.getItem("currencyCodes");

        if(cachedCurrencyCodes){
            setCurrencyCodes(JSON.parse(cachedCurrencyCodes));
            setLoadingCurrencyCodes(false);
        }
        else{
            axiosInstance.get("/currency/codes/")
            .then(response => {
                setCurrencyCodes(response.data);
                sessionStorage.setItem("currencyCodes", JSON.stringify(response.data));
                setLoadingCurrencyCodes(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingCurrencyCodes(false);
            });
        }
    }, []);

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value}));
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        axiosInstance.get(`/currency/?code=${formData.currency}`).then(
            response => {
                setCurrencyData(response.data);
                setIsCurrencyDataLoaded(true);
            }
        )
        .catch(err => {
            console.error(err);
            setIsCurrencyDataLoaded(true);
        });
    }

    return (
        <>
            <div className={styles.market_dashboard_container}>
                <h1>Market Dashboard</h1>
                {loadingCurrencyCodes ? (
                    <p>Loading data...</p>
                ) : (
                    <form className={styles.currency_form} onSubmit={handleFormSubmit}>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleFormInputChange}
                        >
                            {currencyCodes.map((code) => <option key={code} value={code}>{code}</option>)}
                        </select>
                        <button type="submit">Get Currency Rates</button>
                    </form>
                )}
                {isCurrencyDataLoaded && 
                    <div className={styles.currency_result_info_container}>
                        <p>{currencyData.rates[0].mid}</p>
                        <p>{currencyData.rates[0].effectiveDate}</p>
                    </div>
                }
            </div>
        </>
    )
}