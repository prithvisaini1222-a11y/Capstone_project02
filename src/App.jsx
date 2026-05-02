import React, { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './hooks'
import { useDarkMode } from './hooks'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import Loader from './components/ui/Loader'
import ErrorBoundary from './components/ui/ErrorBoundary'
import LoginPage from './pages/LoginPage'

// Lazy loaded pages
const Dashboard    = lazy(() => import('./pages/Dashboard'))
const Posture      = lazy(() => import('./pages/Posture'))
const Appointments = lazy(() => import('./pages/Appointments'))
const Analytics    = lazy(() => import('./pages/Analytics'))
const Insights     = lazy(() => import('./pages/Insights'))
const Profile      = lazy(() => import('./pages/Profile'))

function PrivateLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-wrapper">
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/"             element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard"    element={<Dashboard />} />
                <Route path="/posture"      element={<Posture />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/analytics"    element={<Analytics />} />
                <Route path="/insights"     element={<Insights />} />
                <Route path="/profile"      element={<Profile />} />
                <Route path="*"             element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { isAuth } = useAppSelector(s => s.auth)
  const { dark }   = useAppSelector(s => s.ui)
  useDarkMode(dark)

  if (!isAuth) return <LoginPage />
  return <PrivateLayout />
}
