import Card from "../components/Card";
import Table from "../components/Table";


const siniestros = [
  { tipo: "Derrame", locacion: "Me las rosas", situacion: "En proceso", fecha: "04-07-2024" },
  { tipo: "Colisión", locacion: "Lomas turbas", situacion: "Cerrado", fecha: "03-07-2024" },
];

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Panel de Control</h1>
      <div className="cards-container">
        <Card title="Total de Siniestros" value={10} />
        <Card title="En Proceso" value={2} />
        <Card title="Cerrados" value={4} />
      </div>
      <h2>Siniestros Recientes</h2>
      <Table data={siniestros} />
    </div>
  );
}
