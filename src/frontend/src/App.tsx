import { Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import Accounts from './pages/Accounts'
import AccountDetail from './pages/AccountDetail'
import GraphPage from './pages/GraphPage'
import MeetingDetail from './pages/MeetingDetail'
import Overview from './pages/Overview'
import Sentiment from './pages/Sentiment'
import Themes from './pages/Themes'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/sentiment" element={<Sentiment />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/:account" element={<AccountDetail />} />
        <Route path="/meetings/:id" element={<MeetingDetail />} />
      </Route>
    </Routes>
  )
}
