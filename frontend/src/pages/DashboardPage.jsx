import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { getMediaUrl } from "../utils/media";

function DashboardPage() {
  const { user, logout, accessToken } = useContext(AuthContext);
  const token = accessToken || localStorage.getItem("accessToken");

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token) {
      api.get("my-profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
          console.log("PROFIL DASHBOARD :", res.data);
          setProfile(res.data);
      })
      .catch((err) => console.error(err));
    }
  }, [token]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h1>Tableau de bord</h1>

        <div className="d-flex gap-2 flex-wrap">
          <Link to="/dashboard/temoignages" className="btn btn-dark">
            Gérer les témoignages
          </Link>

          <button className="btn btn-outline-danger" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="dashboard-profile-card">
        <div className="dashboard-profile-photo">
          {profile?.photo ? (
            <img
              src={getMediaUrl(profile.photo)}
              alt={profile.first_name_display}
            />
          ) : (
            <div className="dashboard-photo-placeholder">
              Photo de profil
            </div>
          )}
        </div>

        <div className="dashboard-profile-content">
          <h2>
            {profile?.first_name_display || user?.username}{" "}
            {profile?.last_name_display || ""}
          </h2>

          <p><strong>Nom d’utilisateur :</strong> {user?.username}</p>
          <p><strong>Email :</strong> {user?.email || "Non renseigné"}</p>
          <p><strong>Rôle :</strong> {user?.role}</p>
          <p><strong>Téléphone :</strong> {user?.phone || "Non renseigné"}</p>
          <p><strong>Diplômes :</strong> {profile?.diplomas || "Non renseigné"}</p>
          <p><strong>Années d’expérience :</strong> {profile?.years_experience ?? 0}</p>
          <p><strong>Présentation :</strong> {profile?.short_bio || "Non renseignée"}</p>
          <p><strong>Approche éducative :</strong> {profile?.educational_approach || "Non renseignée"}</p>
          <p>
            <strong>Visible sur le site :</strong>{" "}
            {profile?.is_active_on_site ? "Oui" : "Non"}
          </p>

          <div className="mt-4">
            <Link to="/dashboard/profil" className="btn btn-primary">
              Modifier mon profil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;