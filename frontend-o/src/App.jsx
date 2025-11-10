import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { RegisterMaintainer } from './pages/RegisterMaintainer'
import { RegisterUser } from './pages/RegisterUser'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import DetalleSensor from './pages/DetalleSensor'
import PrivateRoute from './utils/PrivateRoute'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Registro usuario de mantención */}
        <Route path="/register-maintainer" element={<RegisterMaintainer />} />

        {/* Registro usuario común */}
        <Route path="/register-user" element={<RegisterUser />} />

        {/* Home protegido */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />


        {/* Detalle sensor protegido */}
        <Route
          path="/dashboard/:id"
          element={
            <PrivateRoute>
              <DetalleSensor />
            </PrivateRoute>
          }
        />

        {/* Redirigir root */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
