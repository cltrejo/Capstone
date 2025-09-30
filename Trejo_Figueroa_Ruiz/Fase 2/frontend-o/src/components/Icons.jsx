import { useState, useEffect } from 'react';

export function Room() {
    const [fillColor, setFillColor] = useState('#99CA88');
    
    const colors = ['#99CA88', '#FF6B6B', '#4ECDC4', '#FFE66D', '#6A0572', '#06D6A0'];
    
    useEffect(() => {
        let colorIndex = 0;
        
        const interval = setInterval(() => {
            colorIndex = (colorIndex + 1) % colors.length;
            setFillColor(colors[colorIndex]);
        }, 2000);
        
        return () => clearInterval(interval);
    }, []);
    
    return (
        <svg width="100%" height="auto" viewBox="0 0 400 300" style={{maxWidth: '52%'}}>
            <path 
                d="M50,50 L350,50 L350,250 L280,250 L280,200 L220,200 L220,250 L50,250 Z" 
                fill={fillColor}
                stroke="#081FF6" 
                strokeWidth="4"
                strokeOpacity="0.7"
                style={{
                    transition: 'fill 0.8s ease-in-out' // Transición suave
                }}
            />
        </svg>
    )
}