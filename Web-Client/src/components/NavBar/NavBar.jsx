import styles from "./NavBar.module.scss";

import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <div className={styles.navbar_container}>
            <Link to="/"><img src="/favicon.png" alt="InfoDock Logo" /></Link>
            <div className={styles.market_and_weather_links_container}>
                <Link to="/marketDashboard">Market Dashboard</Link>
                <Link to="/weatherDashboard">Weather Dashboard</Link>
            </div>
        </div>
    );
}