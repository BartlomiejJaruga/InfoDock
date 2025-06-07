import styles from "./MarketForm.module.scss";

import axiosInstance from "@services/axiosInstance";
import { useState } from "react";


export default function MarketForm({ currencyCodes, setCurrencyData, setIsCurrencyDataLoaded }) {
    const [formData, setFormData] = useState({
        currency: "",
        startDate: null,
        endDate: null,
    });


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
    );
}