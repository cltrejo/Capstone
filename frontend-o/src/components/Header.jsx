import { useLocation, useNavigate } from 'react-router-dom'
import './Header.css'

export function Header (){
    const location = useLocation()
    const navigate = useNavigate()

    const logout = () => {
        console.log('Cerrando sesión...')
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        navigate('/login')
    }

    const user = localStorage.getItem('username')

    const goToHome = () => {
        navigate('/home')
    }

    return (
        <>
            <div className="container">
                {/* Logo a la izquierda */}
                <img 
                    src="https://bluetekglobal.com/wp-content/uploads/2024/06/logo-tagline@2x.png" 
                    onClick={goToHome} 
                    alt='Logo' 
                    className="logo"
                /> 
                
                {/* Contenido centrado */}
                <div className="center-content">
                    {(location.pathname === '/home' || location.pathname === '/dashboard') && (
                        <p className='msg'>Bienvenido {user?.toUpperCase()}!</p>
                    )}
                </div>

                {/* Contenido a la derecha */}
                <div className="right-content">
                    {(location.pathname === '/home' || location.pathname === '/dashboard') &&(
                        <>
                            <button className='btn-cerrar' onClick={logout}>
                                Cerrar Sesión
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default Header