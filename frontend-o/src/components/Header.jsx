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

    const goToHome = () => {
        navigate('/home')
    }

    return (
        <>
            <div className="container">
                <img 
                src="https://bluetekglobal.com/wp-content/uploads/2024/06/logo-tagline@2x.png" 
                onClick={goToHome} 
                alt='Logo' 
                /> 
                               {/* Botón que solo aparece en /home */}
                {(location.pathname === '/home' || location.pathname === '/dashboard') &&(
                    <>
                        <p className='msg'>Bienvendido {user.toUpperCase()}!</p>
                        <a className='msg' onClick={()=>{navigate('/dashboard')}} style={{cursor: 'pointer'}}>Dashboard</a>
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