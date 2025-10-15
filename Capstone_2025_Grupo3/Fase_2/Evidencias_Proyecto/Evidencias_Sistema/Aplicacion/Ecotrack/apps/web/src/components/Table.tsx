type Siniestro = {
  tipo: string;
  locacion: string;
  situacion: string;
  fecha: string;
};

type TableProps = {
  data: Siniestro[];
};

export default function Table({ data }: TableProps) {
  return (
    <table className="siniestros-table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Locación</th>
          <th>Situación</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {data.map((s, i) => (
          <tr key={i}>
            <td>{s.tipo}</td>
            <td>{s.locacion}</td>
            <td>
              <span className={s.situacion === "En proceso" ? "status in-progress" : "status closed"}>
                {s.situacion}
              </span>
            </td>
            <td>{s.fecha}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
