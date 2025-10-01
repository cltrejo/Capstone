import { useState, useEffect } from "react";

export function useSensor() {
    const [habitaciones, setHabitaciones] = useState([]);
    const [idHabitacionSeleccionada, setIdHabitacionSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Derivar la habitación seleccionada directamente desde habitaciones
    const habitacionSeleccionada = habitaciones.find(
        h => h.id_habitacion === idHabitacionSeleccionada
    );

    useEffect(() => {
        obtenerHabitaciones();

        const intervaloSimulacion = setInterval(() => {
            simularCambiosTemperatura();
        }, 15000);

        return () => clearInterval(intervaloSimulacion);
    }, []);

    const obtenerHabitaciones = async () => {
        try {
            setCargando(true);
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/lista_habitaciones/", {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("📊 Habitaciones recibidas:", data);
                setHabitaciones(data);

                // Seleccionar la primera si no hay ninguna
                if (data.length > 0 && !idHabitacionSeleccionada) {
                    setIdHabitacionSeleccionada(data[0].id_habitacion);
                    console.log("🏠 Habitación inicial seleccionada:", data[0].nombre);
                }
            }
        } catch (error) {
            console.error("Error obteniendo habitaciones:", error);
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

            const response = await fetch("http://localhost:8000/api/lista_habitaciones/", {
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                setHabitaciones(data);
            }
        } catch (error) {
            console.error("Error simulando temperatura:", error);
        }
    };

    return {
        habitaciones,
        habitacionSeleccionada,
        idHabitacionSeleccionada,
        setIdHabitacionSeleccionada,
        cargando,
        obtenerHabitaciones,
        simularCambiosTemperatura
    };
}
