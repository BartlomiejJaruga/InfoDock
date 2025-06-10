import styles from "./MarketHistoryDashboard.module.scss";

import MarketCurrencyHistory from "@components/MarketCurrencyHistory/MarketCurrencyHistory";

export default function MarketHistoryDashboard() {


    
    return (
        <>
            <div className={styles.market_history_dashboard_container}>
                <h1>Market History Dashboard</h1>
                <MarketCurrencyHistory className={styles.market_currency_history_container}/>
            </div>
        </>
    )
}