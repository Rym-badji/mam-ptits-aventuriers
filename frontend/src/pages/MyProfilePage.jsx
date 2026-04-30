import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function MyProfilePage() {
  const { accessToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    first_name_display: "",
    last_name_display: "",
    diplomas: "",
    years_experience: 0,
    short_bio: "",
    educational_approach: "",
    is_active_on_site: true,
  });
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    api.get("my-profile/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      setFormData({
        first_name_display: res.data.first_name_display || "",
        last_name_display: res.data.last_name_display || "",
        diplomas: res.data.diplomas || "",
        years_experience: res.data.years_experience || 0,
        short_bio: res.data.short_bio || "",
        educational_approach: res.data.educational_approach || "",
        is_active_on_site: res.data.is_active_on_site,
      });
    });
  }, [accessToken]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (photo) {
      data.append("photo", photo);
    }

    await api.put("my-profile/", data, authHeaders);
    setMessage("Profil mis à jour avec succès.");
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Mon profil assistante</h1>

      {message && <div className="alert alert-success">{message}</div>}

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Prénom affiché</label>
          <input
            type="text"
            className="form-control"
            name="first_name_display"
            value={formData.first_name_display}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nom affiché</label>
          <input
            type="text"
            className="form-control"
            name="last_name_display"
            value={formData.last_name_display}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Diplômes</label>
          <textarea
            className="form-control"
            name="diplomas"
            value={formData.diplomas}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Années d’expérience</label>
          <input
            type="number"
            className="form-control"
            name="years_experience"
            value={formData.years_experience}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Présentation</label>
          <textarea
            className="form-control"
            name="short_bio"
            rows="4"
            value={formData.short_bio}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Approche éducative</label>
          <textarea
            className="form-control"
            name="educational_approach"
            rows="4"
            value={formData.educational_approach}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Photo</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="is_active_on_site"
            checked={formData.is_active_on_site}
            onChange={handleChange}
          />
          <label className="form-check-label">Afficher ce profil sur le site</label>
        </div>

        <button className="btn btn-primary" type="submit">
          Enregistrer
        </button>
      </form>
    </div>
  );
}

export default MyProfilePage;