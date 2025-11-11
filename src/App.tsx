

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AuditLogs from './pages/AuditLogs';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PricingPlans from './pages/PricingPlans';
import Profile from './pages/Profile';
import Users from './pages/Users';
import WalletCredit from './pages/WalletCredit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/pricing" element={<PricingPlans />} />
          <Route path="/wallet-credit" element={<WalletCredit />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
