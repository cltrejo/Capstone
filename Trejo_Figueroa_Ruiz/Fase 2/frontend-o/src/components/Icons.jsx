import { useState, useEffect } from 'react';

export function Room({ svgContent, temperatura }) {
    const [fillColor, setFillColor] = useState('#99CA88');
    
    // Función para mapear temperatura a color
    const temperaturaAColor = (temp) => {
        if (temp === null || temp === undefined) return '#99CA88';
        
        if (temp < 18) return '#87CEEB';      // Azul - Frío
        if (temp < 20) return '#98FB98';      // Verde claro - Fresco
        if (temp < 23) return '#FFD700';      // Amarillo - Templado
        if (temp < 26) return '#FFA500';      // Naranja - Cálido
        return '#FF4500';                     // Rojo - Caliente
    };
    
    // Actualizar color cuando cambia la temperatura
    useEffect(() => {
        if (temperatura !== null && temperatura !== undefined) {
            setFillColor(temperaturaAColor(temperatura));
        }
    }, [temperatura]);
    
    // Si no hay SVG content, usar uno por defecto
    if (!svgContent) {
        return (
            <svg width="100%" height="auto" viewBox="0 0 400 300" style={{maxWidth: '52%'}}>
                <path 
                    d="M50,50 L350,50 L350,250 L280,250 L280,200 L220,200 L220,250 L50,250 Z" 
                    fill={fillColor}
                    stroke="#081FF6" 
                    strokeWidth="4"
                    strokeOpacity="0.7"
                    style={{
                        transition: 'fill 0.8s ease-in-out'
                    }}
                />
            </svg>
        );
    }
    
    // Renderizar SVG dinámico desde la base de datos
    return (
        <div 
            className="svg-container"
            dangerouslySetInnerHTML={{ 
                __html: svgContent
                    .replace('fill={fillColor}', `fill="${fillColor}"`)
                    .replace('style={{transition: "fill 0.8s ease-in-out"}}', 'style="transition: fill 0.8s ease-in-out"')
            }} 
        />
    );
}

// Componente alternativo más seguro para SVG dinámico
export function DynamicRoom({ svgContent, temperatura }) {
    const [fillColor, setFillColor] = useState('#99CA88');
    
    const temperaturaAColor = (temp) => {
        if (temp === null || temp === undefined) return '#99CA88';
        if (temp < 18) return '#87CEEB';
        if (temp < 20) return '#98FB98';
        if (temp < 23) return '#FFD700';
        if (temp < 26) return '#FFA500';
        return '#FF4500';
    };
    
    useEffect(() => {
        if (temperatura !== null && temperatura !== undefined) {
            setFillColor(temperaturaAColor(temperatura));
        }
    }, [temperatura]);
    
    // Parsear el SVG y modificar el fill dinámicamente
    const svgModificado = svgContent
        .replace(/fill=\{fillColor\}/g, `fill="${fillColor}"`)
        .replace(/fill="[^"]*"/g, `fill="${fillColor}"`)
        .replace(/style=\{\{[^}]*\}\}/g, 'style="transition: fill 0.8s ease-in-out"');
    
    return (
        <div 
            className="svg-container"
            dangerouslySetInnerHTML={{ __html: svgModificado }} 
        />
    );
}

export function NotFoundIcon() {
    return (
        <svg width="800px" height="800px" viewBox="-20 0 190 190" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M38.155 140.475L48.988 62.1108L92.869 67.0568L111.437 91.0118L103.396 148.121L38.155 140.475ZM84.013 94.0018L88.827 71.8068L54.046 68.3068L44.192 135.457L98.335 142.084L104.877 96.8088L84.013 94.0018ZM59.771 123.595C59.394 123.099 56.05 120.299 55.421 119.433C64.32 109.522 86.05 109.645 92.085 122.757C91.08 123.128 86.59 125.072 85.71 125.567C83.192 118.25 68.445 115.942 59.771 123.595ZM76.503 96.4988L72.837 99.2588L67.322 92.6168L59.815 96.6468L56.786 91.5778L63.615 88.1508L59.089 82.6988L64.589 79.0188L68.979 85.4578L76.798 81.5328L79.154 86.2638L72.107 90.0468L76.503 96.4988Z" fill="#000000"/>
        </svg>
    );
}