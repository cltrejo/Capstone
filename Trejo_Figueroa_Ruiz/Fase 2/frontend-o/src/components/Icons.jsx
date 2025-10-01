import { useState, useEffect } from 'react';

export function Room({ svgContent, temperatura }) {
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
    
    // Si no hay SVG content, usar uno por defecto
    if (!svgContent) {
        return (
            <svg width="100%" height="300" viewBox="0 0 400 300" style={{maxWidth: '52%'}}>  {/* ← Cambiado height */}
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
    
    // Procesar el SVG para corregir problemas
    const svgProcesado = svgContent
        .replace(/height="auto"/g, 'height="300"')  // ← Corregir height
        .replace(/fill=\{fillColor\}/g, `fill="${fillColor}"`)
        .replace(/style=\{\{.*?\}\}/g, `style="transition: fill 0.8s ease-in-out"`)
        .replace(/strokeWidth=/g, 'stroke-width=')
        .replace(/strokeOpacity=/g, 'stroke-opacity=');
    
    return (
        <div 
            className="svg-container"
            dangerouslySetInnerHTML={{ __html: svgProcesado }} 
        />
    );
}

export function NotFoundIcon() {
    return (
        <svg width="800" height="800" viewBox="-20 0 190 190">  {/* ← Height fijo */}
            <path fillRule="evenodd" clipRule="evenodd" d="M38.155 140.475L48.988 62.1108L92.869 67.0568L111.437 91.0118L103.396 148.121L38.155 140.475ZM84.013 94.0018L88.827 71.8068L54.046 68.3068L44.192 135.457L98.335 142.084L104.877 96.8088L84.013 94.0018ZM59.771 123.595C59.394 123.099 56.05 120.299 55.421 119.433C64.32 109.522 86.05 109.645 92.085 122.757C91.08 123.128 86.59 125.072 85.71 125.567C83.192 118.25 68.445 115.942 59.771 123.595ZM76.503 96.4988L72.837 99.2588L67.322 92.6168L59.815 96.6468L56.786 91.5778L63.615 88.1508L59.089 82.6988L64.589 79.0188L68.979 85.4578L76.798 81.5328L79.154 86.2638L72.107 90.0468L76.503 96.4988Z" fill="#000000"/>
        </svg>
    );
}