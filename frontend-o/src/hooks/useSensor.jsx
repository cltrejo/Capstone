import { useState, useEffect } from "react";

export function useSensor() {
    const [zonas, setZonas] = useState([]);
    const [idZonaSeleccionada, setIdZonaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Derivar la habitación seleccionada directamente desde habitaciones
    const zonaSeleccionada = zonas.find(
        h => h.id_zona  === idZonaSeleccionada
    );

    useEffect(() => {
        obtenerZonas();

        const intervaloSimulacion = setInterval(() => {
            simularCambiosTemperatura();
        }, 30000);

        return () => clearInterval(intervaloSimulacion);
    }, []);

    const obtenerZonas = async () => {
        try {
            setCargando(true);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/lista_zonas/", {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("📊 Zonas recibidas:", data);
                setZonas(data);

                // Seleccionar la primera si no hay ninguna
                if (data.length > 0 && !idZonaSeleccionada) {
                    setIdZonaSeleccionada(data[0].id_zona);
                    console.log("🏠 Zona inicial seleccionada:", data[0].nombre);
                }
            }
        } catch (error) {
            console.error("Error obteniendo zonas:", error);
        } finally {
            setCargando(false);
        }
    };

    const simularCambiosTemperatura = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("🔄 Simulando cambios de temperatura...");

            await fetch("http://localhost:8000/api/simular_temperatura/", {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const response = await fetch("http://localhost:8000/api/lista_zonas/", {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                setZonas(data);
            }
        } catch (error) {
            console.error("Error simulando temperatura:", error);
        }
    };

    return {
        zonas,
        zonaSeleccionada,
        idZonaSeleccionada,
        setIdZonaSeleccionada,
        cargando,
        obtenerZonas,
        simularCambiosTemperatura
    };
}
