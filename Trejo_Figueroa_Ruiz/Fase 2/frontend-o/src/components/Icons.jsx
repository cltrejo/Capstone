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

export function NotFoundIcon (){
    return(
        <svg 
            fill="#000000" 
            height="800px" 
            width="800px" 
            version="1.1" 
            id="Capa_1" 
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
        >
            <g>
                <path d="M9,39h6v8c0,0.552,0.448,1,1,1s1-0.448,1-1v-8h3c0.552,0,1-0.448,1-1s-0.448-1-1-1h-3v-2c0-0.552-0.448-1-1-1s-1,0.448-1,1
                    v2h-5V27c0-0.552-0.448-1-1-1s-1,0.448-1,1v11C8,38.552,8.448,39,9,39z"/>
                <path d="M40,39h6v8c0,0.552,0.448,1,1,1s1-0.448,1-1v-8h3c0.552,0,1-0.448,1-1s-0.448-1-1-1h-3v-2c0-0.552-0.448-1-1-1
                    s-1,0.448-1,1v2h-5V27c0-0.552-0.448-1-1-1s-1,0.448-1,1v11C39,38.552,39.448,39,40,39z"/>
                <path d="M29.5,48c3.584,0,6.5-2.916,6.5-6.5v-9c0-3.584-2.916-6.5-6.5-6.5S23,28.916,23,32.5v9C23,45.084,25.916,48,29.5,48z
                    M25,32.5c0-2.481,2.019-4.5,4.5-4.5s4.5,2.019,4.5,4.5v9c0,2.481-2.019,4.5-4.5,4.5S25,43.981,25,41.5V32.5z"/>
                <path d="M0,0v14v46h60V14V0H0z M2,2h56v10H2V2z M58,58H2V14h56V58z"/>
                <polygon points="54.293,3.293 52,5.586 49.707,3.293 48.293,4.707 50.586,7 48.293,9.293 49.707,10.707 52,8.414 54.293,10.707 
                    55.707,9.293 53.414,7 55.707,4.707   "/>
                <path d="M3,11h39V3H3V11z M5,5h35v4H5V5z"/>
            </g>
        </svg>
    )
}