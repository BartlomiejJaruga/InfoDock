import styles from "./MarketCurrencyHistoryList.module.scss";

import MarketCurrencyChart from "@components/MarketCurrencyChart/MarketCurrencyChart";

export default function MarketCurrencyHistoryList({ currencyHistoryData }) {
    return (
        <div className={styles.market_currency_history_list_container}>
            {currencyHistoryData.map((currencyInfo) => (
                
                <div className={styles.single_currency_info_container}>
                    <h1>{currencyInfo.code}</h1>
                    <MarketCurrencyChart
                        data={currencyInfo.rates} 
                        xAxisDataKey={"date"} 
                        yAxisDataKey={"rate"} 
                        lineColor={"#00B4D8"}
                    />
                </div>
            ))}
        </div>
    );
}
