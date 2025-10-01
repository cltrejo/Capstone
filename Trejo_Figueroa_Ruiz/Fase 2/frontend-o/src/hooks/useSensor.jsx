import { useState, useEffect } from "react";

export function useSensor(){
    const [habitaciones, setHabitaciones] = useState([]);
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);
    
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
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/lista_habitaciones/', {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('📊 Habitaciones recibidas:', data); // Debug
                setHabitaciones(data);
                
                // Solo establecer la primera habitación si no hay una seleccionada
                if (data.length > 0 && !habitacionSeleccionada) {
                    setHabitacionSeleccionada(data[0]);
                    console.log('🏠 Habitación inicial seleccionada:', data[0].nombre); // Debug
                }
            }
        } catch (error) {
            console.error('Error obteniendo habitaciones:', error);
        } finally {
            setCargando(false);
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
            
            // Solo refrescar datos, no cambiar la selección
            const response = await fetch('http://localhost:8000/api/lista_habitaciones/', {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setHabitaciones(data);
                
                // Mantener la habitación seleccionada actualizada
                if (habitacionSeleccionada) {
                    const habActualizada = data.find(h => h.id_habitacion === habitacionSeleccionada.id_habitacion);
                    if (habActualizada) {
                        setHabitacionSeleccionada(habActualizada);
                    }
                }
            }
        } catch (error) {
            console.error('Error simulando temperatura:', error);
        }
    };

    return { 
        habitaciones, 
        habitacionSeleccionada, 
        setHabitacionSeleccionada, 
        cargando,
        obtenerHabitaciones, 
        simularCambiosTemperatura 
    }
}