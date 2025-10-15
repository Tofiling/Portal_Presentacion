import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";  // Importa useNavigate
import "../App.css";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();  // Inicializa useNavigate

  const user = {
    nombre: "Juann",
    cargo: "Administrador",
    correo: "juan.perez@example.com",
    foto: "https://i.pravatar.cc/150", 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);


  const handleLogout = () => {
    // Aquí puedes limpiar datos de sesión o tokens si tienes
    navigate("/login");  // Redirige a login
  };

  return (
    <div className="profile-container" ref={menuRef}>
      {/* Icono pequeño */}
      <img
        src={user.foto}
        alt="Perfil"
        className="profile-icon"
        onClick={() => setOpen(!open)}
      />

      {/* Menú desplegable */}
      {open && (
        <div className="profile-menu">
          <img src={user.foto} alt="perfil" className="profile-photo-large" />
          <div className="profile-info">
            <h3>{user.nombre}</h3>
            <p>{user.cargo}</p>
            <p>{user.correo}</p>
          </div>
          <div className="profile-actions">
            <button>Configuración</button>
            <button onClick={handleLogout}>Cerrar sesión</button> {/* Aquí */}
          </div>
        </div>
      )}
    </div>
  );
}