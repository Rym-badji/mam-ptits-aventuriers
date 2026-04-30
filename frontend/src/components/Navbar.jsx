import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { accessToken, user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          M.A.M Des P'tits Aventuriers
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <div className="navbar-nav ms-auto">

            <Link className="nav-link" to="/page/la-mam">La MAM</Link>
            <Link className="nav-link" to="/equipe">L’équipe</Link>
            <Link className="nav-link" to="/page/projet-pedagogique">Projet pédagogique</Link>
            <Link className="nav-link" to="/page/locaux">Locaux</Link>
            <Link className="nav-link" to="/page/activites">Activités</Link>
            <Link className="nav-link" to="/tarifs">Tarifs</Link>
            <Link className="nav-link" to="/disponibilites">Disponibilités</Link>
            <Link className="nav-link" to="/contact">Contact</Link>

            {/* 🔥 Partie dynamique */}
            {!accessToken ? (
              <Link className="nav-link" to="/connexion">
                Connexion
              </Link>
            ) : (
              <>
                <Link className="nav-link" to="/dashboard">
                  {user?.username || "Dashboard"}
                </Link>

                <button
                  className="btn btn-link nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={logout}
                >
                  Déconnexion
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;