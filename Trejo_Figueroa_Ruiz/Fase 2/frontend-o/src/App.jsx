import { Routes, Route, Navigate} from 'react-router-dom'
import { Login } from './pages/Login'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='*' element={<Navigate to="/login" replace />} />

      </Routes>
    </>
  )
}

export default App
