import { useState, useId } from 'react'
import Header from '../components/Header'
import './Login.css'

export function Login (){
 
    
    const [credentials, setCredentials] = useState({
        username : "",
        password : ""
    }) 

    const usuarioId = useId()
    const contraseñaId = useId()

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (event) =>{
        event.preventDefault();
        console.log("Enviando: ",credentials);

        const response = await fetch("http://localhost:8000/api/login/",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials)
        })

        const data = await response.json()

        console.log(data);
    }

    return (
        <>
        <div className='content'>
            <header>
                <Header/>
            </header>
            <main>
                <div>
                    <form className='form' onSubmit={handleSubmit}>
                        <label htmlFor={usuarioId}>
                            Usuario
                        </label>
                        <input 
                            type='text'
                            id={usuarioId}
                            name='username'
                            value={credentials.username}
                            onChange={handleChange}
                        />
                        <label htmlFor={contraseñaId}>
                            Contraseña
                        </label>
                        <input 
                            type='password'
                            id={contraseñaId}
                            name='password'
                            value={credentials.password}
                            onChange={handleChange}
                        />
                        <button type='submit' className='submit-btn'>Ingresar</button>
                    </form>
                </div>
            </main>
        </div>
        </>
    )
}

export default Login