import { useState, useEffect } from "react";
import styles from "./MarketCurrencyHistory.module.scss";

import MarketCurrencyHistoryList from "@components/MarketCurrencyHistoryList/MarketCurrencyHistoryList";
import LoadingIndicator from "@components/LoadingIndicator/LoadingIndicator";
import axiosInstance from "@services/axiosInstance";

export default function MarketCurrencyHistory() {
    const [currencyHistoryData, setCurrencyHistoryData] = useState([]);
    const [currencyHistoryDataLoadingError, setCurrencyHistoryDataLoadingError] = useState(false);
    const [loadingCurrencyHistoryData, setLoadingCurrencyHistoryData] = useState(true);
    
    useEffect(() => {
        getCurrencyHistory();
    }, []); 

    const getCurrencyHistory = () => {
        setLoadingCurrencyHistoryData(true);

        axiosInstance.get("/currency/currency-history/")
            .then(response => {
                console.log(response.data);
                setCurrencyHistoryData(response.data);
                setCurrencyHistoryDataLoadingError(false);
                setLoadingCurrencyHistoryData(false);
            })
            .catch(err => {
                console.error(err);
                setCurrencyHistoryDataLoadingError(true);
                setLoadingCurrencyHistoryData(false);
            });
    }


    return (
        <div className={styles.market_currency_history_container}>
            {loadingCurrencyHistoryData && (
                <LoadingIndicator message={"Loading saved history data..."} fontSize={"1rem"} />
            )}

            {!loadingCurrencyHistoryData && currencyHistoryDataLoadingError && (
                <div>
                    <h1>error!</h1>
                </div>
            )}

            {!loadingCurrencyHistoryData && !currencyHistoryDataLoadingError && (
                <MarketCurrencyHistoryList currencyHistoryData={currencyHistoryData}/>
            )}
        </div>
    );
}