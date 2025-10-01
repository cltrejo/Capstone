import { Header } from '../components/Header';
import { Room } from '../components/Icons';
import { useSensor } from '../hooks/useSensor';
import './Home.css';

export function Home() {
    const { 
        habitaciones, 
        habitacionSeleccionada, 
        idHabitacionSeleccionada, 
        setIdHabitacionSeleccionada 
    } = useSensor();

    return (
        <div className="content">
            <header>
                <Header/>
            </header>

            <main>
                {/* Selector de habitaciones */}
                <div className="habitacion-selector">
                    <label>Seleccionar Habitación: </label>
                    <select 
                        value={idHabitacionSeleccionada || ''}
                        onChange={(e) => setIdHabitacionSeleccionada(parseInt(e.target.value))}
                    >
                        <option value="">Selecciona una habitación</option>
                        {habitaciones.map(hab => (
                            <option key={hab.id_habitacion} value={hab.id_habitacion}>
                                {hab.nombre} ({hab.temperatura_actual ? `${hab.temperatura_actual}°C` : 'Sin datos'})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Mostrar habitación seleccionada */}
                {habitacionSeleccionada && (
                    <div className="habitacion-container">
                        <h2 className='titulo-hab'>{habitacionSeleccionada.nombre}</h2>
                        <p>Temperatura actual: {habitacionSeleccionada.temperatura_actual 
                            ? `${habitacionSeleccionada.temperatura_actual}°C` 
                            : 'No disponible'}</p>

                        <Room 
                        svgContent={habitacionSeleccionada.forma_svg}
                        temperatura={habitacionSeleccionada.temperatura_actual}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;
