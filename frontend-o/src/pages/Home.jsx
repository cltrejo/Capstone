import { Header } from '../components/Header';
import { Room } from '../components/Icons';
import { useSensor } from '../hooks/useSensor';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export function Home() {
    const { 
        habitaciones, 
        habitacionSeleccionada, 
        idHabitacionSeleccionada, 
        setIdHabitacionSeleccionada 
    } = useSensor();

    const navigate = useNavigate();

    const handleDetalleClick = async () => {
        if (!habitacionSeleccionada) {
            alert("Selecciona primero una habitación.");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:8000/api/habitaciones/${habitacionSeleccionada.id_habitacion}/sensores/`, {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) throw new Error("No se pudo obtener el sensor");

            const sensores = await res.json();
            if (sensores.length === 0) {
                alert("No hay sensores en esta habitación");
                return;
            }

            const sensorId = sensores[0].id_sensor; 
            navigate(`/sensor/${sensorId}`);
        } catch (err) {
            console.error(err);
            alert("Error al buscar el sensor");
        }
    };

    return (
        <div className="content">
            <header>
                <Header />
            </header>

            <main className="main-container">
                {/* Selector de habitación */}
                <div className="selector-top">
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
                </div>

                {/* Contenedor de la habitación seleccionada */}
                <div className="habitacion-section">
                    {habitacionSeleccionada ? (
                        <div className="habitacion-container">
                            <h2 className="titulo-hab">{habitacionSeleccionada.nombre}</h2>
                            <p>
                                Temperatura actual:{" "}
                                {habitacionSeleccionada.temperatura_actual 
                                    ? `${habitacionSeleccionada.temperatura_actual}°C` 
                                    : 'No disponible'}
                            </p>

                            {habitacionSeleccionada.temperatura_actual >= 27 && (
                                <p className="alerta-temp">🔥 Temperatura alta detectada</p>
                            )}

                            <Room 
                                svgContent={habitacionSeleccionada.forma_svg}
                                temperatura={habitacionSeleccionada.temperatura_actual}
                            />

                            <button className="detalle-btn" onClick={handleDetalleClick}>
                                Ver detalle del sensor
                            </button>
                        </div>
                    ) : (
                        <div className="no-habitacion">
                            <p>Selecciona una habitación para ver los detalles</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;