import { useState } from "react";
import "../App.css";

interface HistorialItem {
  id: number;
  fecha: string;
  lugar: string;
  comuna: string;
  resuelto: boolean;
  descripcion: string;
}

const dataPrueba: HistorialItem[] = [
  { id: 1, fecha: "2025-09-12", lugar: "Av. Providencia", comuna: "Providencia", resuelto: true, descripcion: "Choque leve entre dos autos." },
  { id: 2, fecha: "2025-09-10", lugar: "Autopista Central", comuna: "Santiago", resuelto: false, descripcion: "Colisión múltiple, 3 vehículos involucrados." },
  { id: 3, fecha: "2025-09-08", lugar: "Calle Falsa 123", comuna: "Las Condes", resuelto: true, descripcion: "Vehículo perdió el control, sin lesionados." },
];

export default function Historial() {
  const [selected, setSelected] = useState<HistorialItem | null>(null);

  return (
    <div className="historial-container">
      <h1>Historial de Siniestros</h1>
      <div className="historial-burbujas">
        {dataPrueba.map((item) => (
          <div
            key={item.id}
            className={`burbuja ${item.resuelto ? "resuelto" : "pendiente"}`}
            onClick={() => setSelected(item)}
          >
            <h3>{item.lugar}</h3>
            <p>{item.comuna}</p>
            <p>{item.fecha}</p>
            <span>{item.resuelto ? "Resuelto" : "Pendiente"}</span>
          </div>
        ))}
      </div>

      {/* Modal de detalle */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Detalle del Siniestro</h2>
            <p><strong>Lugar:</strong> {selected.lugar}</p>
            <p><strong>Comuna:</strong> {selected.comuna}</p>
            <p><strong>Fecha:</strong> {selected.fecha}</p>
            <p><strong>Estado:</strong> {selected.resuelto ? "Resuelto ✅" : "Pendiente ❌"}</p>
            <p><strong>Descripción:</strong> {selected.descripcion}</p>
            <button onClick={() => setSelected(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
