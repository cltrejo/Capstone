import { useState, useEffect } from "react";

export function useSensor(){
    const [habitaciones, setHabitaciones] = useState([]);
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
    
    useEffect(() => {
        obtenerHabitaciones();
        
        const intervaloSimulacion = setInterval(() => {
            simularCambiosTemperatura();
        }, 15000);
        
        return () => clearInterval(intervaloSimulacion);
    }, []);
    
    const obtenerHabitaciones = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/lista_habitaciones/', {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setHabitaciones(data);
                if (data.length > 0) {
                    setHabitacionSeleccionada(data[0]);
                }
            }
        } catch (error) {
            console.error('Error obteniendo habitaciones:', error);
        }
    };
    
    const simularCambiosTemperatura = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:8000/api/simular_temperatura/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            obtenerHabitaciones();
        } catch (error) {
            console.error('Error simulando temperatura:', error);
        }
    };

    return { habitaciones, setHabitaciones, habitacionSeleccionada, setHabitacionSeleccionada, obtenerHabitaciones, simularCambiosTemperatura }
}