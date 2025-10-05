import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import './Login.css'
import { isAuthenticated } from '../utils/auth'

export function Login (){
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")   // 👈 estado de error
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated()
      if (auth) {
        navigate('/home', { replace: true })
      }
    }
    checkAuth()
  }, [navigate])

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (event) =>{
    event.preventDefault()
    setLoading(true)
    setError("")   // reset

    const response = await fetch("http://localhost:8000/api/login/",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    })

    const data = await response.json()
    setLoading(false)

    if (response.ok) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("username", data.user.username)
      navigate('/home', { replace: true })
    } else {
      setError("⚠️ Credenciales incorrectas. Inténtalo nuevamente.")  // 👈 mensaje bonito
    }
  }

  return (
    <div className='content-login'>
      <header><Header/></header>
      <main>
        <div>
          <form className='form' onSubmit={handleSubmit}>
            <label>Usuario</label>
            <input type='text' name='username' value={credentials.username} onChange={handleChange}/>
            <label>Contraseña</label>
            <input type='password' name='password' value={credentials.password} onChange={handleChange}/>
            <button type='submit' className='submit-btn' disabled={loading}>
              {loading ? 'Entrando...' : 'Ingresar'}
            </button>
            {/* 👇 mostramos error si existe */}
            {error && <p className="error-msg">{error}</p>}
          </form>

        </div>
      </main>
    </div>
  )
}

export default Login
