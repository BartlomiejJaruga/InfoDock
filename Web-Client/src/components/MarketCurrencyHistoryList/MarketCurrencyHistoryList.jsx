import styles from "./MarketCurrencyHistoryList.module.scss";

import MarketCurrencyChart from "@components/MarketCurrencyChart/MarketCurrencyChart";

export default function MarketCurrencyHistoryList({ currencyHistoryData }) {

    console.log("currency data" + currencyHistoryData);

    return (
        <div className={styles.market_currency_history_list_container}>
            {currencyHistoryData.map((currencyInfo) => (
                <div className={styles.single_currency_info_container}>
                    <h1>{currencyInfo.code}</h1>
                </div>
            ))}
        </div>
    );
}