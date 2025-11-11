import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import './Login.css'
import { isAuthenticated } from '../utils/auth'

export function RegisterMaintainer (){
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.nombre || !formData.apellidoPaterno || !formData.apellidoMaterno || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Completa todos los campos.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('https://5g6lhmg0-8000.brs.devtunnels.ms/api/register-maintainer/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido_paterno: formData.apellidoPaterno,
          apellido_materno: formData.apellidoMaterno,
          email: formData.email,
          password: formData.password,
          role: 'maintainer'
        })
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setSuccess('Usuario de mantención creado correctamente. Ahora puedes iniciar sesión.')
        setFormData({ nombre: '', apellidoPaterno: '', apellidoMaterno: '', email: '', password: '', confirmPassword: '' })
        setTimeout(() => navigate('/login'), 1200)
      } else {
        setError(data?.detail || 'No fue posible registrar el usuario.')
      }
    } catch (err) {
      setError('Error de red. Inténtalo nuevamente.', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='content-login'>
      <header><Header/></header>
      <main>
        <div>
          <form className='form' onSubmit={handleSubmit}>
            <h2 style={{ marginTop: 0, marginBottom: 16, color: '#0c145a' }}>Registrar usuario de mantención</h2>
            <label>Nombre</label>
            <input type='text' name='nombre' value={formData.nombre} onChange={handleChange} placeholder='Ingresa tu nombre'/>
            <label>Apellido Paterno</label>
            <input type='text' name='apellidoPaterno' value={formData.apellidoPaterno} onChange={handleChange} placeholder='Ingresa tu apellido paterno'/>
            <label>Apellido Materno</label>
            <input type='text' name='apellidoMaterno' value={formData.apellidoMaterno} onChange={handleChange} placeholder='Ingresa tu apellido materno'/>
            <label>Email</label>
            <input type='email' name='email' value={formData.email} onChange={handleChange} placeholder='correo@dominio.com'/>
            <label>Contraseña</label>
            <input type='password' name='password' value={formData.password} onChange={handleChange} placeholder='********'/>
            <label>Confirmar contraseña</label>
            <input type='password' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder='********'/>
            <button type='submit' className='submit-btn' disabled={loading}>
              {loading ? 'Creando...' : 'Crear cuenta'}
            </button>
            {error && <p className='error-msg'>{error}</p>}
            {success && <p className='error-msg' style={{ background: '#e6ffed', borderColor: '#2ecc71', color: '#1f7a43' }}>{success}</p>}
          </form>
        </div>
      </main>
    </div>
  )
}

export default RegisterMaintainer


