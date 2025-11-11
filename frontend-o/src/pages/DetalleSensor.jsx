import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import Header from "../components/Header";
import './DetalleSensor.css';

export function Dashboard() {
  const { id } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("24h");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchDashboardData() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/dashboard_zona/${id}/`, {
          headers: { "Authorization": `Token ${token}` }
        });
        const data = await res.json();
        console.log("Dashboard data recibida:", data);
        setDashboardData(data);
        
        // Procesar datos para el gráfico
        processChartData(data, filter);
        
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
      setLoading(false);
    }

    fetchDashboardData();
  }, [id]); // Solo dependemos del id

  // Efecto separado para procesar datos cuando cambia el filtro
  useEffect(() => {
    if (dashboardData) {
      processChartData(dashboardData, filter);
    }
  }, [filter, dashboardData]);

  const processChartData = (data, currentFilter) => {
    if (!data.thermostatos || data.thermostatos.length === 0) {
      setChartData([]);
      return;
    }

    // Tomamos las mediciones del primer thermostato (puedes ajustar según necesites)
    const mediciones = data.thermostatos[0].mediciones;

        const now = new Date();
        let cutoff;
    if (currentFilter === "1h") cutoff = new Date(now - 1 * 60 * 60 * 1000);
    else if (currentFilter === "6h") cutoff = new Date(now - 6 * 60 * 60 * 1000);
    else if (currentFilter === "24h") cutoff = new Date(now - 24 * 60 * 60 * 1000);
    else if (currentFilter === "7d") cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000);

        // 🔹 Filtramos datos recientes
    const filtered = mediciones.filter(m => new Date(m.timestamp) >= cutoff);

        // 🔹 Determinamos el intervalo de agrupación
        let intervalMs;
    if (currentFilter === "1h") intervalMs = 1 * 60 * 1000;         // cada minuto
    else if (currentFilter === "6h") intervalMs = 5 * 60 * 1000;     // cada 5 min
    else if (currentFilter === "24h") intervalMs = 30 * 60 * 1000;   // cada 30 min
    else if (currentFilter === "7d") intervalMs = 3 * 60 * 60 * 1000; // cada 3 horas

        // 🔹 Agrupar por intervalos
        const grouped = {};
        filtered.forEach(m => {
          const ts = new Date(m.timestamp);
          const bucket = Math.floor(ts.getTime() / intervalMs) * intervalMs;
          if (!grouped[bucket]) grouped[bucket] = [];
          grouped[bucket].push(parseFloat(m.valor));
        });

        // 🔹 Calcular promedios por grupo
        const averaged = Object.entries(grouped).map(([bucket, values]) => ({
          timestamp: new Date(parseInt(bucket)).toLocaleTimeString(),
          valor: values.reduce((a, b) => a + b, 0) / values.length,
        }));

    setChartData(averaged);
  };

  if (loading) return <p>Cargando dashboard...</p>;
  if (!dashboardData) return <p>No se pudo cargar el dashboard</p>;

  const { zona, materiales, thermostatos, sensores } = dashboardData;

  return (
    <div className="dashboard-content">
      <Header />
      <div className="dashboard-wrapper">
        <h2 className="zona-title">{zona.nombre || "Zona desconocida"}</h2>

        {/* 🔹 Filtros de rango temporal */}
        <div className="filters">
          {["1h", "6h", "24h", "7d"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              Últimas {f}
            </button>
          ))}
        </div>

        {/* 🔹 Indicadores rápidos */}
        <div className="stats-grid">
          <div className="stat-card">
              <h3>Temperatura Actual</h3>
              <p className="stat-value">
              {zona.temperatura_actual ? `${zona.temperatura_actual}°C` : "N/D"}
              </p>
          </div>

          <div className="stat-card">
              <h3>Material principal</h3>
            <p>{materiales[0]?.nombre || "Concreto"}</p>
          </div>

          <div className="stat-card">
              <h3>Superficie</h3>
            <p>{zona.superficie_m3 || 0} m³</p>
          </div>

          <div className="stat-card">
              <h3>Orientación</h3>
            <p>{zona.orientation || "Norte"}</p>
          </div>
        </div>

        {/* 🔹 Información adicional de sensores */}
        {sensores && sensores.length > 0 && (
          <div className="sensors-section">
            <h3>Sensores de Energía</h3>
            <div className="sensors-grid">
              {sensores.map(sensor => (
                <div key={sensor.id_sensor} className="sensor-card">
                  <h4>{sensor.nombre}</h4>
                  <p>Tipo: {sensor.tipo}</p>
                  <p>Última medición: {sensor.mediciones[0]?.valor || "N/D"} {sensor.mediciones[0]?.unidad || ""}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔹 Gráfico histórico */}
        <div className="chart-section">
          <h3>Evolución de la temperatura</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value) => [`${value}°C`, "Temperatura"]}
                labelFormatter={(label) => `Hora: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="valor" 
                stroke="#007BFF" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
                name="Temperatura"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🔹 Información de thermostatos */}
        {thermostatos && thermostatos.length > 0 && (
          <div className="thermostats-section">
            <h3>Thermostatos</h3>
            <div className="thermostats-grid">
              {thermostatos.map(thermo => (
                <div key={thermo.id_thermostato} className="thermo-card">
                  <h4>{thermo.nombre}</h4>
                  <p>Mediciones recientes: {thermo.mediciones.length}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;