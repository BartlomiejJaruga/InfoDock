import styles from "./SaveCurrencyDataButton.module.scss";

import { useState } from "react";
import axiosInstance from "@services/axiosInstance";
import LoadingIndicator from "@components/LoadingIndicator/LoadingIndicator";

export default function SaveCurrencyDataButton({ data }) {
    const [savingCurrencyDataError, setSavingCurrencyDataError] = useState(false);
    const [savingCurrencyData, setSavingCurrencyData] = useState(false);
    const [currencyDataSaved, setCurrencyDataSaved] = useState(false);
    
    const saveCurrencyDataToDatabase = () => {
        setSavingCurrencyData(true);

        axiosInstance.post("/currency/currency-history/save/", data)
            .then(response => {
                console.log(response.data);
                setSavingCurrencyDataError(false);
                setCurrencyDataSaved(true);
                setSavingCurrencyData(false);
            })
            .catch(err => {
                console.error(err);
                setSavingCurrencyDataError(true);
                setCurrencyDataSaved(false);
                setSavingCurrencyData(false);
            });
    }

    return (
        <div className={styles.save_currency_data_button_container}>
            {!currencyDataSaved && !savingCurrencyDataError && (
                <button className={styles.button} onClick={saveCurrencyDataToDatabase}>
                    Save currency data
                </button>
            )}

            {savingCurrencyData && (
                <LoadingIndicator message={"Saving..."} fontSize={"1rem"} />
            )}

            {!currencyDataSaved && savingCurrencyDataError && (
                <div>
                    <p>failed to save the data, please try again later</p>
                    <button className={styles.button} onClick={saveCurrencyDataToDatabase}>
                        Retry saving
                    </button>
                </div>
            )}
        </div>
    );
}