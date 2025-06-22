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
import { AdminRoleProvider } from "./Context/AdminContext";
import TermsAndConditions from "./pages/TermsAndConditions";
import RequireAdmin from "./routes/restrict/RequireAdmin";
import AdminOverview from "./feature/admin/pages/AdminOverview";
import AdminUsers from "./feature/admin/pages/AdminUsers";
import AdminSchedules from "./feature/admin/pages/AdminSchedules";
import AdminActivities from "./feature/admin/pages/AdminActivities";
import AdminQueries from "./feature/admin/pages/AdminQueries";
import AdminUserDetail from "./feature/admin/pages/AdminUserDetails";

// App Routes shouldn't have been here and instead in its own file

function App() {
  return (
    <AuthProvider>
      <AdminRoleProvider>
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
            <Route path="/terms_of_service" element={<TermsAndConditions/>}/>

            {/* Admin Only */}
            <Route element={ <RequireAdmin /> }>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/users/:id/details" element={<AdminUserDetail />} />
              <Route path="/admin/schedules" element={<AdminSchedules />} />
              <Route path="/admin/activities" element={<AdminActivities />} />
              <Route path="/admin/queries" element={<AdminQueries />} />
            </Route>

            <Route path="*"  element={<NotFound />} />
          </Route>
        </Routes>
      </AdminRoleProvider>
    </AuthProvider>
  )
}

export default App