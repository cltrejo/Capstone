import { useLocation, useNavigate } from 'react-router-dom'
import './Header.css'

export function Header (){
    const location = useLocation()
    const navigate = useNavigate()

    const logout = () => {
        // Tu lógica de cierre de sesión
        console.log('Cerrando sesión...')
        // Ejemplo: limpiar localStorage y redirigirv
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        navigate('/login')
    }

    const user = localStorage.getItem('username')

    console.log(user)

    return (
        <>
            <div className="container">
                <img src="https://bluetekglobal.com/wp-content/uploads/2024/06/logo-tagline@2x.png" alt='Logo' />                {/* Botón que solo aparece en /home */}
                {location.pathname === '/home' && (
                    <>
                        <p className='msg'>Bienvendido {user}!</p>
                        <button className='btn-cerrar' onClick={logout}>
                            Cerrar Sesión
                        </button>
                    </>
                )}
            </div>
        </>
    )
}

export default Header