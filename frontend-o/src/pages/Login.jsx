import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import './Login.css'
import { isAuthenticated } from '../utils/auth'
import endpoints from '../api'

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

    try {
      // 🔥 Usas el endpoint definido en /api/index.js
      const { data } = await endpoints.auth.login(credentials);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);

      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      setError("⚠️ Credenciales incorrectas. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

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
            <Link to="/register-user" className="register-link">
              ¿No tienes cuenta? Regístrate
            </Link>
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
