import styles from "./MarketDashboard.module.scss";

import { useEffect, useState } from "react";
import axiosInstance from "@services/axiosInstance";
import MarketForm from "@components/MarketForm/MarketForm";
import LoadingIndicator from "@components/LoadingIndicator/LoadingIndicator";

export default function MarketDashboard() {
    const [loadingErrors, setLoadingErrors] = useState({
        loadingCurrencyCodesError: null,
    });

    const [currencyCodes, setCurrencyCodes] = useState([]);
    const [loadingCurrencyCodes, setLoadingCurrencyCodes] = useState(true);
    
    const [currencyData, setCurrencyData] = useState({});
    const [isCurrencyDataLoaded, setIsCurrencyDataLoaded] = useState(false);

    useEffect(() => {
        getCurrencyCodes();
    }, []);

    const getCurrencyCodes = () => {
        setLoadingCurrencyCodes(true);
        setLoadingErrors((prev) => ({ ...prev, loadingCurrencyCodesError: null}));

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
                setLoadingErrors((prev) => ({ ...prev, loadingCurrencyCodesError: "failed to load currency codes from server"}));
                setLoadingCurrencyCodes(false);
            });
        }
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
                        setIsCurrencyDataLoaded={setIsCurrencyDataLoaded}
                    />
                )}

                {!loadingCurrencyCodes && loadingErrors.loadingCurrencyCodesError !== null && (
                    <div className={styles.error_message_container}>
                        <p>Error: {loadingErrors.loadingCurrencyCodesError}</p>
                        <button onClick={getCurrencyCodes}>Retry</button>
                    </div>
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