import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './store/DataContext';
import { AuthProvider } from './store/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/public/Home';
import Login from './pages/public/Login';
import NotAuthorized from './pages/public/NotAuthorized';

import StaffDashboard from './pages/staff/StaffDashboard';
import Members from './pages/staff/Members';
import MemberDetail from './pages/staff/MemberDetail';
import Purchase from './pages/staff/Purchase';
import Inventory from './pages/staff/Inventory';
import MemberAccounts from './pages/staff/MemberAccounts';
import Sale from './pages/staff/Sale';
import Withdrawal from './pages/staff/Withdrawal';
import Expenses from './pages/staff/Expenses';

import MemberDashboard from './pages/member/MemberDashboard';
import MemberAccount from './pages/member/MemberAccount';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />

            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute allow={['staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/members"
              element={
                <ProtectedRoute allow={['staff']}>
                  <Members />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/members/:id"
              element={
                <ProtectedRoute allow={['staff']}>
                  <MemberDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/purchase"
              element={
                <ProtectedRoute allow={['staff']}>
                  <Purchase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/inventory"
              element={
                <ProtectedRoute allow={['staff']}>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/accounts"
              element={
                <ProtectedRoute allow={['staff']}>
                  <MemberAccounts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/sale"
              element={
                <ProtectedRoute allow={['staff']}>
                  <Sale />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/withdrawal"
              element={
                <ProtectedRoute allow={['staff']}>
                  <Withdrawal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/expenses"
              element={
                <ProtectedRoute allow={['staff']}>
                  <Expenses />
                </ProtectedRoute>
              }
            />

            <Route
              path="/member/dashboard"
              element={
                <ProtectedRoute allow={['member']}>
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/account"
              element={
                <ProtectedRoute allow={['member']}>
                  <MemberAccount />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
