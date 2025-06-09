import './App.scss'

import { Route, Routes } from 'react-router-dom'
import HomePage from '@pages/HomePage/HomePage'
import MarketDashboard from '@pages/MarketDashboard/MarketDashboard'
import MarketHistoryDashboard from '@pages/MarketHistoryDashboard/MarketHistoryDashboard'
import NotFoundPage from '@pages/NotFoundPage/NotFoundPage'
import NavBar from '@components/NavBar/NavBar'

function App() {

  return (
    <div className="main_app_layout">
      <NavBar />
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/marketDashboard' element={<MarketDashboard/>} />
        <Route path='/marketHistoryDashboard' element={<MarketHistoryDashboard/>} />
        <Route path='*' element={<NotFoundPage/>} />
      </Routes>
    </div>
  )
}

export default App
