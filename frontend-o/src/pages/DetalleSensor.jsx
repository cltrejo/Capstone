import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Header from "../components/Header";
import './DetalleSensor.css'

export function DetalleSensor() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/thermostatos/${id}/mediciones/`, {
      headers: {
        "Authorization": `Token ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        // Normalizamos la data para recharts
        const formatted = data.map(item => ({
          valor: parseFloat(item.valor),
          unidad: item.unidad,
          timestamp: new Date(item.timestamp).toLocaleTimeString()
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando histórico...</p>;

  return (
        <div className="content">
        <Header />
        <div className="detalle-wrapper">
            <h2 className="sensor-nom">Histórico del Thermostato {id}</h2>
            <div className="chart-card">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valor" stroke="#081FF6" name="Valor" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
            </div>
        </div>
        </div>

  );
}

export default DetalleSensor;
