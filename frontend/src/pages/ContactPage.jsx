import { useState } from "react";
import api from "../api/axios";

function ContactPage() {
  const [formData, setFormData] = useState({
    parent_first_name: "",
    parent_last_name: "",
    phone: "",
    email: "",
    child_age: "",
    desired_date: "",
    hours_per_week: "",
    requested_days: "",
    message: "",
    rgpd_accepted: false,
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    if (!formData.parent_first_name || !formData.parent_last_name) return "Nom et prénom requis.";
    if (!formData.email.includes("@")) return "Email invalide.";
    if (!formData.rgpd_accepted) return "Vous devez accepter le traitement des données.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      await api.post("contacts/", formData);
      setSuccess("Votre demande a bien été envoyée.");
      setError("");
      setFormData({
        parent_first_name: "",
        parent_last_name: "",
        phone: "",
        email: "",
        child_age: "",
        desired_date: "",
        hours_per_week: "",
        requested_days: "",
        message: "",
        rgpd_accepted: false,
      });
    } catch {
      setError("Erreur lors de l’envoi du formulaire.");
      setSuccess("");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Pré-inscription / Contact</h1>

      <div className="row g-4">
        <div className="col-lg-7">
          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form className="card p-4 shadow-sm border-0" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Prénom du parent</label>
                <input type="text" className="form-control" name="parent_first_name" value={formData.parent_first_name} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Nom du parent</label>
                <input type="text" className="form-control" name="parent_last_name" value={formData.parent_last_name} onChange={handleChange} required />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Téléphone</label>
                <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Âge de l’enfant</label>
                <input type="text" className="form-control" name="child_age" value={formData.child_age} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Date souhaitée</label>
                <input type="date" className="form-control" name="desired_date" value={formData.desired_date} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Heures / semaine</label>
                <input type="number" className="form-control" name="hours_per_week" value={formData.hours_per_week} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Jours demandés</label>
              <input type="text" className="form-control" name="requested_days" value={formData.requested_days} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows="5" name="message" value={formData.message} onChange={handleChange} />
            </div>

            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" name="rgpd_accepted" checked={formData.rgpd_accepted} onChange={handleChange} required />
              <label className="form-check-label">
                J’accepte le traitement de mes données dans le cadre de ma demande.
              </label>
            </div>

            <button className="btn btn-primary" type="submit">Envoyer</button>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="card p-4 shadow-sm border-0 mb-4">
            <h2 className="h4">Coordonnées</h2>
            <p><strong>Adresse :</strong> Adresse de la MAM à compléter</p>
            <p><strong>Téléphone :</strong> 06 00 00 00 00</p>
            <p><strong>Email :</strong> contact@mam-aventuriers.fr</p>
          </div>

          <div className="card shadow-sm border-0 overflow-hidden">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps?q=Essonne&output=embed"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;