import { Routes, Route } from "react-router-dom";
import './App.css'
import NotFound from './pages/NotFound'
import Layout from './components/Layout';
import Schedule from './pages/Schedule';
import AuthPage from './pages/Access';
import Homepage from './pages/HomePage';
import Activity from './pages/Activity';
import Performance from './pages/Performance';
import MonthlyReview from './pages/MonthlyReview';
import LifeOverview from './pages/LifeOverview';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './Context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Homepage />} />
          <Route path="/access" element={<AuthPage />}  />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/activity_list" element={<Activity />} /> 
          <Route path="/performance" element={<Performance/>} />
          <Route path="/monthly_review/:month" element={<MonthlyReview/>} />
          <Route path="/life_overview/:year" element={<LifeOverview />} />
          <Route path="*"  element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App