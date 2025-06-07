import styles from "./MarketDashboard.module.scss";

import { useEffect, useState } from "react";
import axiosInstance from "@services/axiosInstance";
import MarketForm from "@components/MarketForm/MarketForm";
import LoadingIndicator from "@components/LoadingIndicator/LoadingIndicator";
import MarketCurrencyChart from "@components/MarketCurrencyChart/MarketCurrencyChart";

export default function MarketDashboard() {
    const [loadingErrors, setLoadingErrors] = useState({
        loadingCurrencyCodesError: null,
        loadingCurrencyDataError: null,
    });

    const [currencyCodes, setCurrencyCodes] = useState([]);
    const [loadingCurrencyCodes, setLoadingCurrencyCodes] = useState(true);
    
    const [currencyData, setCurrencyData] = useState({});
    const [loadingCurrencyData, setLoadingCurrencyData] = useState(false);
    const [hasUserStartedLoadingCurrencyData, setHasUserStartedLoadingCurrencyData] = useState(false);


    useEffect(() => {
        getCurrencyCodes();
    }, []);

    const getCurrencyCodes = () => {
        setLoadingCurrencyCodes(true);

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
                setLoadingErrors((prev) => ({ ...prev, loadingCurrencyCodesError: null}));
                setLoadingCurrencyCodes(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingErrors((prev) => ({ ...prev, loadingCurrencyCodesError: "failed to load currency codes from server"}));
                setLoadingCurrencyCodes(false);
            });
        }
    }

    const reduceCurrencyData = (rates) => {
        return rates.reduce((accumulator, rate) => {
            accumulator.push({ date: rate.effectiveDate, rate: rate.mid});

            return accumulator;
        }, [])
    }
    

    return (
        <>
            <div className={styles.market_dashboard_container}>
                <h1>Market Dashboard</h1>

                {loadingCurrencyCodes && (
                    <LoadingIndicator message={"Loading data..."} fontSize={"1rem"}/>
                )}

                {!loadingCurrencyCodes && loadingErrors.loadingCurrencyCodesError === null && (
                    <MarketForm 
                        currencyCodes={currencyCodes} 
                        setCurrencyData={setCurrencyData} 
                        setLoadingCurrencyData={setLoadingCurrencyData}
                        setLoadingErrors={setLoadingErrors}
                        setHasUserStartedLoadingCurrencyData = {setHasUserStartedLoadingCurrencyData}
                    />
                )}

                {!loadingCurrencyCodes && loadingErrors.loadingCurrencyCodesError !== null && (
                    <div className={styles.error_message_container}>
                        <p>Error: {loadingErrors.loadingCurrencyCodesError}</p>
                        <button onClick={getCurrencyCodes}>Retry</button>
                    </div>
                )}

                {loadingCurrencyData && (
                    <LoadingIndicator message={"Loading currency data..."} fontSize={"1rem"} />
                )}

                {hasUserStartedLoadingCurrencyData && !loadingCurrencyData && loadingErrors.loadingCurrencyDataError === null && (
                    <div className={styles.currency_result_info_container}>
                        {(currencyData.rates.length === 1) ? (
                            <div className={styles.single_currency_result_info_container}>
                                <p>date: {currencyData.rates[0].effectiveDate}</p>
                                <p>rate: {currencyData.rates[0].mid}</p>
                            </div>
                        ) : (
                            <MarketCurrencyChart 
                                data={reduceCurrencyData(currencyData.rates)} 
                                xAxisDataKey={"date"} 
                                yAxisDataKey={"rate"} 
                                lineColor="#00B4D8"    
                            />
                        )}
                    </div>
                )}

                {hasUserStartedLoadingCurrencyData && !loadingCurrencyData && loadingErrors.loadingCurrencyDataError !== null && (
                    <div className={styles.error_message_container}>
                        <p>Error: {loadingErrors.loadingCurrencyDataError}</p>
                    </div>
                )}
            </div>
        </>
    )
}