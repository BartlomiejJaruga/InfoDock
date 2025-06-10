import { useEffect } from "react";
import styles from "./MarketCurrencyChart.module.scss";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';




export default function MarketCurrencyChart({ data, xAxisDataKey, yAxisDataKey, lineColor }) {

    useEffect(() => {
        console.log("rendered Chart");
        console.log(data);
    })

    return (
        <div className={styles.market_currency_chart_container}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxisDataKey} />
                    <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} />
                    <Tooltip />
                    <Line type="linear" dataKey={yAxisDataKey} stroke={lineColor} strokeWidth={1.5} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}