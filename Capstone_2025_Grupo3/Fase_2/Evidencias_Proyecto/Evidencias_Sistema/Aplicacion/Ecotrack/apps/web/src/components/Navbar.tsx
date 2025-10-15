import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "./Roles";
import "../App.css";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">EcoTrack</div>
        <div className="navbar-links">
          <Link to="/">Dashboard</Link>
          <Link to="/historial">Historial</Link>

          {/* Solo admin ve Configuración */}
          {user?.role === "admin" && (
            <Link to="/configuracion">Configuración</Link>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <ProfileMenu />
      </div>
    </nav>
  );
}
