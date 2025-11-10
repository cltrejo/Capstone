import { Header } from '../components/Header';
import { Room } from '../components/Icons';
import { useSensor } from '../hooks/useSensor';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export function Home() {
    const { 
        zonas, 
        zonaSeleccionada, 
        idZonaSeleccionada, 
        setIdZonaSeleccionada 
    } = useSensor();

    const navigate = useNavigate();

    const handleDetalleClick = async () => {
        if (!zonaSeleccionada) {
            alert("Selecciona primero una zona.");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:8000/api/habitaciones/${zonaSeleccionada.id_zona}/sensores/`, {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) throw new Error("No se pudo obtener el sensor");

            const sensores = await res.json();
            console.log("Respuesta completa de sensores:", sensores);
            
            if (sensores.length === 0) {
                alert("No hay sensores en esta zona");
                return;
            }

            console.log("Primer sensor:", sensores[0]);
            
            const sensorId = sensores[0].id_thermostato || sensores[0].id || sensores[0].id_sensor;
            console.log("Sensor ID encontrado:", sensorId);
            
            if (!sensorId) {
                alert("No se pudo identificar el sensor");
                return;
            }

            navigate(`/dashboard/${sensorId}`);
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
                {/* Selector arriba a la izquierda */}
                <div className="selector-top-left">
                    <div className="habitacion-selector">
                        <label>Seleccionar Zona: </label>
                        <select 
                            value={idZonaSeleccionada || ''}
                            onChange={(e) => setIdZonaSeleccionada(parseInt(e.target.value))}
                        >
                            <option value="">Selecciona una zona</option>
                            {zonas.map(hab => (
                                <option key={hab.id_zona} value={hab.id_zona}>
                                    {hab.nombre} ({hab.temperatura_actual ? `${hab.temperatura_actual}°C` : 'Sin datos'})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Contenedor principal centrado - 95% del viewport */}
                <div className="main-content">
                    {zonaSeleccionada ? (
                        <div className="habitacion-container">
                            <h2 className="titulo-hab">{zonaSeleccionada.nombre}</h2>
                            <p>
                                Temperatura actual:{" "}
                                {zonaSeleccionada.temperatura_actual 
                                    ? `${zonaSeleccionada.temperatura_actual}°C` 
                                    : 'No disponible'}
                            </p>

                            {zonaSeleccionada.temperatura_actual >= 27 && (
                                <p className="alerta-temp">🔥 Temperatura alta detectada</p>
                            )}

                            <Room 
                                svgContent={zonaSeleccionada.forma_svg}
                                temperatura={zonaSeleccionada.temperatura_actual}
                            />

                            <button className="detalle-btn" onClick={handleDetalleClick}>
                                Ver Dashboard
                            </button>
                        </div>
                    ) : (
                        <div className="no-habitacion">
                            <p>Selecciona una zona para ver los detalles</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;