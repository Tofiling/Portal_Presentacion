import { useState } from "react";
import "../App.css";

interface IUser {
  nombres: string;
  apellidos: string;
  rut: string;
  password: string;
  cargo?: string;
  region?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Configuracion() {
  const [form, setForm] = useState<IUser>({
    nombres: "",
    apellidos: "",
    rut: "",
    password: "",
    cargo: "Operador",
    region: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [usuarios, setUsuarios] = useState<IUser[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, updatedAt: new Date() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsuarios((prev) => [...prev, form]);
    setForm({
      nombres: "",
      apellidos: "",
      rut: "",
      password: "",
      cargo: "Operador",
      region: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <div className="configuracion-container">
      <h1>Gestión de Usuarios / Roles</h1>

      <form className="config-form" onSubmit={handleSubmit}>
        <label>
          Nombres:
          <input
            type="text"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Apellidos:
          <input
            type="text"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          RUT:
          <input
            type="text"
            name="rut"
            value={form.rut}
            onChange={handleChange}
            placeholder="12.345.678-9"
            required
          />
        </label>

        <label>
          Contraseña:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Cargo:
          <select name="cargo" value={form.cargo} onChange={handleChange}>
            <option value="Jefe de Área">Jefe de Área</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Operador">Operador</option>
          </select>
        </label>

        <label>
          Región:
          <input
            type="text"
            name="region"
            value={form.region}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Crear Rol</button>
      </form>

      <h2>Crear Rol (prueba local)</h2>
      <ul className="roles-list">
        {usuarios.map((u, i) => (
          <li key={i} className="rol-item">
            <strong>{u.nombres} {u.apellidos}</strong> - {u.cargo} <br />
            <small>{u.rut} | {u.region}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
