import { Header } from '../components/Header'
import { Room } from '../components/Icons';
import { useSensor } from '../hooks/useSensor';
import './Home.css'


export function Home (){

    const { habitacionSeleccionada, setHabitacionSeleccionada, habitaciones } = useSensor()
    
 return (
        <>
        <div className='content'>
            <header>
                <Header/>
            </header>
            
            <main>
                {/* Selector de habitaciones */}
                <div className="habitacion-selector">
                    <label>Seleccionar Habitación: </label>
                    <select 
                        value={habitacionSeleccionada?.id || ''} 
                        onChange={(e) => {
                            const hab = habitaciones.find(h => h.id === parseInt(e.target.value));
                            setHabitacionSeleccionada(hab);
                        }}
                    >
                        <option value="">Selecciona una habitación</option>
                        {habitaciones.map(hab => (
                            <option key={hab.id} value={hab.id}>
                                {hab.nombre} ({hab.temperatura_actual ? `${hab.temperatura_actual}°C` : 'Sin datos'})
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Mostrar habitación seleccionada */}
                {habitacionSeleccionada && (
                    <div className="habitacion-container">
                        <h2>{habitacionSeleccionada.nombre}</h2>
                        <p>Temperatura actual: {habitacionSeleccionada.temperatura_actual ? `${habitacionSeleccionada.temperatura_actual}°C` : 'No disponible'}</p>
                        
                        <Room 
                            svgContent={habitacionSeleccionada.forma_svg}
                            temperatura={habitacionSeleccionada.temperatura_actual}
                        />
                    </div>
                )}
            </main>
        </div>
        </>
    )
}

export default Home