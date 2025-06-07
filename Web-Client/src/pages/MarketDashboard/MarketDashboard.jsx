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
    const [currencyDataType, setCurrencyDataType] = useState("currency"); // "currency" | "gold"

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
                setCurrencyCodes(response.data.sort());
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
        }, []);
    }

    const reduceGoldData = (data) => {
        return data.reduce((accumulator, dayData) => {
            accumulator.push({ date: dayData.data, price: dayData.cena});

            return accumulator;
        }, []);
    }

    const countRatesMean = (rates) => {
        const ratesSum = rates.reduce((accumulator, rate) => {
            accumulator += rate.mid;

            return accumulator;
        }, 0);

        return ratesSum/rates.length;
    }

    const countGoldPriceMean = (data) => {
        const priceSum = data.reduce((accumulator, dayData) => {
            accumulator += dayData.cena;

            return accumulator;
        }, 0);

        return priceSum/data.length;
    }

    

    return (
        <>
            <div className={styles.market_dashboard_container}>
                <h1 className={styles.market_dashboard_header}>Market Dashboard</h1>

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
                        setCurrencyDataType = {setCurrencyDataType}
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
                        {console.log(currencyData)}
                        {currencyDataType === "currency" && currencyData.rates.length === 1 && (
                            <div className={styles.currency_result_info_details_container}>
                                <div className={styles.currency_result_info_mean_rate_container}>
                                    <h3>Currency Mean Rate (selected range):</h3>
                                    <div className={styles.currency_result_info_mean_rate_grid_container}>
                                        <div>{currencyData.code}</div>
                                        <div>{`<--->`}</div>
                                        <div>PLN</div>
                                        <div>1</div>
                                        <div>{countRatesMean(currencyData.rates)}</div>
                                    </div>
                                </div>
                                
                                <div className={styles.single_currency_result_info_container}>
                                    <h3>{currencyData.code}</h3>
                                    <p>date: {currencyData.rates[currencyData.rates.length-1].effectiveDate}</p>
                                    <p>rate: {currencyData.rates[currencyData.rates.length-1].mid}</p>
                                </div>
                            </div>
                        )}

                        {currencyDataType === "currency" && currencyData.rates.length > 1 && (
                            <div className={styles.currency_result_info_wrapper}>
                                <div className={styles.currency_result_info_details_container}>
                                    <div className={styles.currency_result_info_mean_rate_container}>
                                        <h3>Currency Mean Rate (selected range):</h3>
                                        <div className={styles.currency_result_info_mean_rate_grid_container}>
                                            <div>{currencyData.code}</div>
                                            <div>{`<--->`}</div>
                                            <div>PLN</div>
                                            <div>1</div>
                                            <div>{countRatesMean(currencyData.rates)}</div>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.single_currency_result_info_container}>
                                        <h3>{currencyData.code}</h3>
                                        <p>date: {currencyData.rates[currencyData.rates.length-1].effectiveDate}</p>
                                        <p>rate: {currencyData.rates[currencyData.rates.length-1].mid}</p>
                                    </div>
                                </div>
                                <MarketCurrencyChart 
                                    data={reduceCurrencyData(currencyData.rates)} 
                                    xAxisDataKey={"date"} 
                                    yAxisDataKey={"rate"} 
                                    lineColor="#00B4D8"    
                                />
                            </div>
                        )}

                        {currencyDataType === "gold" && currencyData.length === 1 && (
                            <div className={styles.gold_result_info_details_container}>
                                <div className={styles.gold_result_info_mean_rate_container}>
                                    <h3>Gold Mean Rate (selected range):</h3>
                                    <div className={styles.gold_result_info_mean_rate_grid_container}>
                                        <div>{`Gold (gram)`}</div>
                                        <div>{`<--->`}</div>
                                        <div>PLN</div>
                                        <div>1</div>
                                        <div>{countGoldPriceMean(currencyData)}</div>
                                    </div>
                                </div>
                                
                                <div className={styles.single_gold_result_info_container}>
                                    <h3>GOLD</h3>
                                    <p>date: {currencyData[currencyData.length-1].data}</p>
                                    <p>price: {currencyData[currencyData.length-1].cena}</p>
                                </div>
                            </div>  
                        )}

                        {currencyDataType === "gold" && currencyData.length > 1 && (
                            <div className={styles.gold_result_info_wrapper}>
                                <div className={styles.gold_result_info_details_container}>
                                    <div className={styles.gold_result_info_mean_rate_container}>
                                        <h3>Gold Mean Rate (selected range):</h3>
                                        <div className={styles.gold_result_info_mean_rate_grid_container}>
                                            <div>{`Gold (gram)`}</div>
                                            <div>{`<--->`}</div>
                                            <div>PLN</div>
                                            <div>1</div>
                                            <div>{countGoldPriceMean(currencyData)}</div>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.single_gold_result_info_container}>
                                        <h3>GOLD</h3>
                                        <p>date: {currencyData[currencyData.length-1].data}</p>
                                        <p>price: {currencyData[currencyData.length-1].cena}</p>
                                    </div>
                                </div>
                                <MarketCurrencyChart 
                                    data={reduceGoldData(currencyData)} 
                                    xAxisDataKey={"date"} 
                                    yAxisDataKey={"price"} 
                                    lineColor="#FFD700"
                                />
                            </div>
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