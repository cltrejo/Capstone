import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import Header from "../components/Header";
import './DetalleSensor.css';

export function Dashboard() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [zona, setZona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("24h");

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchData() {
      setLoading(true);
      try {
        const zonaRes = await fetch(`http://localhost:8000/api/detalle_zona/${id}`, {
          headers: { "Authorization": `Token ${token}` }
        });
        const zonaData = await zonaRes.json();
        setZona(zonaData);

        const medRes = await fetch(`http://localhost:8000/api/thermostatos/${id}/mediciones/`, {
          headers: { "Authorization": `Token ${token}` }
        });
        const medData = await medRes.json();

        const now = new Date();
        let cutoff;
        if (filter === "1h") cutoff = new Date(now - 1 * 60 * 60 * 1000);
        else if (filter === "6h") cutoff = new Date(now - 6 * 60 * 60 * 1000);
        else if (filter === "24h") cutoff = new Date(now - 24 * 60 * 60 * 1000);
        else if (filter === "7d") cutoff = new Date(now - 7 * 24 * 60 * 60 * 1000);

        // 🔹 Filtramos datos recientes
        const filtered = medData.filter(m => new Date(m.timestamp) >= cutoff);

        // 🔹 Determinamos el intervalo de agrupación
        let intervalMs;
        if (filter === "1h") intervalMs = 1 * 60 * 1000;         // cada minuto
        else if (filter === "6h") intervalMs = 5 * 60 * 1000;     // cada 5 min
        else if (filter === "24h") intervalMs = 30 * 60 * 1000;   // cada 30 min
        else if (filter === "7d") intervalMs = 3 * 60 * 60 * 1000; // cada 3 horas

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

        setData(averaged);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    fetchData();
  }, [id, filter]);

  if (loading) return <p>Cargando dashboard...</p>;

  return (
    <div className="dashboard-content">
      <Header />
      <div className="dashboard-wrapper">
        <h2 className="zona-title">{zona?.nombre || "Zona desconocida"}</h2>

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
                {zona?.temperatura_actual ? `${zona.temperatura_actual}°C` : "N/D"}
              </p>
          </div>

          <div className="stat-card">
              <h3>Material principal</h3>
              <p>{zona?.material_principal || "Concreto"}</p>
          </div>

          <div className="stat-card">
              <h3>Superficie</h3>
              <p>{zona?.superficie || 0} m²</p>
          </div>

          <div className="stat-card">
              <h3>Orientación</h3>
              <p>{zona?.orientacion || "Norte"}</p>
          </div>
        </div>

        {/* 🔹 Gráfico histórico */}
        <div className="chart-section">
          <h3>Evolución de la temperatura</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#007BFF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
