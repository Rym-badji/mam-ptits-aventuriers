import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { getMediaUrl } from "../utils/media";

function TeamPage() {
  const { user } = useContext(AuthContext);
  const role = user?.role || localStorage.getItem("userRole");
  const isAdmin = role === "admin";
  const isAssistant = role === "assistante";

  const [assistantes, setAssistantes] = useState([]);

  useEffect(() => {
    api.get("assistantes/")
      .then((res) => setAssistantes(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container py-5">
      <div className="page-header-medieval mb-5">
        <div>
          <h1>L’équipe</h1>
          <p className="lead">
            Découvrez les assistantes maternelles qui accompagnent les enfants au quotidien.
          </p>
        </div>

        {isAssistant && (
          <Link to="/dashboard/profil" className="btn btn-primary">
            Modifier mon profil
          </Link>
        )}

        {isAdmin && (
          <a href="http://127.0.0.1:8000/admin/staff/user/" className="btn btn-primary">
            Gérer les assistantes
          </a>
        )}
      </div>

      {assistantes.map((assistant, index) => (
        <div
          key={assistant.id}
          className={`section-horizontal-card mb-4 ${index % 2 === 0 ? "section-card-red" : "section-card-parchment"}`}
        >
          <div className="section-horizontal-image">
            {assistant.photo ? (
              <img src={getMediaUrl(assistant.photo)} alt={assistant.first_name_display} />
            ) : (
              <div className="section-image-placeholder">Photo assistante</div>
            )}
          </div>

          <div className="section-horizontal-content">
            <h2>{assistant.first_name_display} {assistant.last_name_display || ""}</h2>
            <p><strong>Diplômes :</strong> {assistant.diplomas || "Non renseigné"}</p>
            <p><strong>Années d’expérience :</strong> {assistant.years_experience}</p>
            <p><strong>Présentation :</strong> {assistant.short_bio || "Non renseignée"}</p>
            <p><strong>Approche éducative :</strong> {assistant.educational_approach || "Non renseignée"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TeamPage;