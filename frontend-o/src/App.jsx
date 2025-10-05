import { Routes, Route, Navigate} from 'react-router-dom'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { DetalleSensor } from './pages/DetalleSensor'
import PrivateRoute from './utils/PrivateRoute'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

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
          path="/sensor/:id"
          element={
            <PrivateRoute>
              <DetalleSensor />
            </PrivateRoute>
          }
        />

        {/* Redirigir root */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
