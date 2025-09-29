import { Header } from '../components/Header'
import './Home.css'

export function Home (){

    const logout = () => {
        window.localStorage.removeItem("token")
        window.location.href = "/"
    };
    
    return (
        <>
        <div className='content'>
            <header>
                <Header/>
            </header>
            <main>
                <h1>Home</h1>

                <button className='btn-cerrar' onClick={logout}>Cerrar Sesión</button>
            </main>
        </div>
        </>
    )
}

export default Home