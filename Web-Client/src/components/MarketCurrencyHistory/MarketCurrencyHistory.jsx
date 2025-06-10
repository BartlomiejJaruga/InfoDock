import { useState, useEffect } from "react";
import styles from "./MarketCurrencyHistory.module.scss";

import MarketCurrencyHistoryList from "@components/MarketCurrencyHistoryList/MarketCurrencyHistoryList";
import LoadingIndicator from "@components/LoadingIndicator/LoadingIndicator";
import axiosInstance from "@services/axiosInstance";

export default function MarketCurrencyHistory() {
    const [currencyHistoryData, setCurrencyHistoryData] = useState([]);
    const [currencyHistoryDataLoadingError, setCurrencyHistoryDataLoadingError] = useState(false);
    const [loadingCurrencyHistoryData, setLoadingCurrencyHistoryData] = useState(true);
    const [currencyHistoryDataDeleteError, setCurrencyHistoryDataDeleteError] = useState(false);

    useEffect(() => {
        getCurrencyHistory();
    }, []); 

    const getCurrencyHistory = () => {
        setLoadingCurrencyHistoryData(true);

        axiosInstance.get("/currency/currency-history/")
            .then(response => {
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

    const handleRemoveCurrencyHistory = () => {
        axiosInstance.delete("/currency/currency-history/delete-all/")
            .then(response => {
                setCurrencyHistoryDataDeleteError(false);
                setCurrencyHistoryData([]);
            })
            .catch(err => {
                console.error(err);
                setCurrencyHistoryDataDeleteError(true);
            });
    }


    return (
        <div className={styles.market_currency_history_container}>
            {loadingCurrencyHistoryData && (
                <LoadingIndicator message={"Loading saved history data..."} fontSize={"1rem"} />
            )}

            {!loadingCurrencyHistoryData && currencyHistoryDataLoadingError && (
                <div className={styles.market_currency_history_error_container}>
                    <h2>Failed to load saved market history, please try again later</h2>
                    <button onClick={getCurrencyHistory}>Retry</button>
                </div>
            )}

            {!loadingCurrencyHistoryData && !currencyHistoryDataLoadingError && currencyHistoryData.length > 0 && (
                <>  
                    <div className={styles.market_currency_history_remove_container}>
                        <div>
                            <button onClick={handleRemoveCurrencyHistory}>Delete History</button>
                            {currencyHistoryDataDeleteError && (
                                <p>Failed to delete currency history, please try again later</p>
                            )}
                        </div>
                    </div>
                    <MarketCurrencyHistoryList currencyHistoryData={currencyHistoryData}/>
                </>
            )}
        </div>
    );
}