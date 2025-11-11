import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import './Login.css'
import { isAuthenticated } from '../utils/auth'
import endpoints from '../api'

export function RegisterUser() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // Si el usuario ya está autenticado, redirigir al home
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
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { username, first_name, last_name, email, password, confirmPassword } = formData

    // Validaciones básicas
    if (!username || !first_name || !last_name || !email || !password || !confirmPassword) {
      setError('Completa todos los campos.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      // 👇 Llamada al endpoint usando Axios
      const { data } = await endpoints.auth.registro({
        username,
        first_name,
        last_name,
        email,
        password,
      })

      console.log("✅ Usuario registrado:", data)

      setSuccess('✅ Usuario creado correctamente. Ahora puedes iniciar sesión.')
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })

      setTimeout(() => navigate('/login'), 1200)

    } catch (err) {
      console.error(err)

      // 🔹 Si el backend devuelve errores de validación
      if (err.response?.data) {
        const data = err.response.data
        const mensaje = 
          data.detail ||
          Object.values(data).flat().join(', ') || 
          'No fue posible registrar el usuario.'
        setError(mensaje)
      } else {
        setError('Error de red. Inténtalo nuevamente.')
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='content-login'>
      <header><Header /></header>
      <main>
        <div>
          <form className='form' onSubmit={handleSubmit}>
            <h2 style={{ marginTop: 0, marginBottom: 16, color: '#0c145a' }}>Registrar usuario común</h2>

            <label>Nombre de usuario</label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='Ingresa tu nombre de usuario'
            />

            <label>Nombre</label>
            <input
              type='text'
              name='first_name'
              value={formData.first_name}
              onChange={handleChange}
              placeholder='Ingresa tu nombre'
            />

            <label>Apellido</label>
            <input
              type='text'
              name='last_name'
              value={formData.last_name}
              onChange={handleChange}
              placeholder='Ingresa tu apellido'
            />

            <label>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='correo@dominio.com'
            />

            <label>Contraseña</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='********'
            />

            <label>Confirmar contraseña</label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='********'
            />

            <button type='submit' className='submit-btn' disabled={loading}>
              {loading ? 'Creando...' : 'Crear cuenta'}
            </button>

            {error && <p className='error-msg'>{error}</p>}
            {success && (
              <p
                className='error-msg'
                style={{
                  background: '#e6ffed',
                  borderColor: '#2ecc71',
                  color: '#1f7a43'
                }}
              >
                {success}
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}

export default RegisterUser
