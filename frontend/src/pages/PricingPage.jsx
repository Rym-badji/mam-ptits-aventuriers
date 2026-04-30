import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function PricingPage() {
  const { accessToken, user } = useContext(AuthContext);
  const token = accessToken || localStorage.getItem("accessToken");
  const role = user?.role || localStorage.getItem("userRole");

  const isAdmin = role === "admin";
  const isAssistant = role === "assistante";
  const canAdd = isAdmin || isAssistant;
  const canEdit = isAdmin || isAssistant;
  const canDelete = isAdmin;

  const [pricing, setPricing] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    hourly_rate: "",
    maintenance_fee: "5.00",
    meal_fee: "5.00",
    payment_terms: "",
    caf_info: "",
    is_active: true,
  });

  const [hoursPerWeek, setHoursPerWeek] = useState(35);
  const [hourlyRate, setHourlyRate] = useState(4.5);
  const [cafAid, setCafAid] = useState(300);

  const loadPricing = () => {
    api.get("pricing/")
      .then((res) => {
        setPricing(res.data);
        if (res.data.length > 0) {
          setHourlyRate(parseFloat(res.data[0].hourly_rate));
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadPricing();
  }, []);

  const resetForm = () => {
    setFormData({
      hourly_rate: "",
      maintenance_fee: "5.00",
      meal_fee: "5.00",
      payment_terms: "",
      caf_info: "",
      is_active: true,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      hourly_rate: item.hourly_rate,
      maintenance_fee: item.maintenance_fee,
      meal_fee: item.meal_fee,
      payment_terms: item.payment_terms || "",
      caf_info: item.caf_info || "",
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (editingItem) {
      await api.put(`admin/pricing/${editingItem.id}/`, formData, { headers });
    } else {
      await api.post("admin/pricing/", formData, { headers });
    }

    resetForm();
    loadPricing();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce tarif ?")) return;

    await api.delete(`admin/pricing/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadPricing();
  };

  const monthlyHours = hoursPerWeek * 4;
  const grossMonthly = monthlyHours * hourlyRate;
  const estimatedBalance = grossMonthly - cafAid;

  return (
    <div className="container py-5">
      <div className="page-header-medieval mb-5">
        <div>
          <h1>Tarifs & aides</h1>
          <p className="lead">Retrouvez les tarifs de la M.A.M et une estimation du reste à charge.</p>
        </div>

        {canAdd && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Fermer" : "Ajouter un tarif"}
          </button>
        )}
      </div>

      {showForm && (
        <form className="card p-4 shadow-sm border-0 mb-4" onSubmit={handleSubmit}>
          <h2 className="h5 mb-3">{editingItem ? "Modifier le tarif" : "Ajouter un tarif"}</h2>

          <div className="mb-3">
            <label className="form-label">Tarif horaire</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={formData.hourly_rate}
              onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Indemnité d’entretien</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={formData.maintenance_fee}
              onChange={(e) => setFormData({ ...formData, maintenance_fee: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Indemnité repas</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={formData.meal_fee}
              onChange={(e) => setFormData({ ...formData, meal_fee: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Modalités de paiement</label>
            <textarea
              className="form-control"
              value={formData.payment_terms}
              onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Informations CAF</label>
            <textarea
              className="form-control"
              value={formData.caf_info}
              onChange={(e) => setFormData({ ...formData, caf_info: e.target.value })}
            />
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary">{editingItem ? "Enregistrer" : "Ajouter"}</button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Annuler</button>
          </div>
        </form>
      )}

      <div className="row g-4 align-items-start">
        {/* COLONNE GAUCHE : TARIFICATION */}
        <div className="col-lg-6">
          <h2 className="mb-3">Tarification</h2>

          {pricing.map((item, index) => (
            <div
              key={item.id}
              className={`pricing-info-card mb-4 ${
                index % 2 === 0 ? "section-card-gold" : "section-card-parchment"
              }`}
            >
              <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                <h3 className="h5 mb-0">Détails</h3>

                {(canEdit || canDelete) && (
                  <div className="d-flex gap-2">
                    {canEdit && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(item)}
                      >
                        Modifier
                      </button>
                    )}

                    {canDelete && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="pricing-line">
                <span>Tarif horaire</span>
                <strong>{item.hourly_rate} €</strong>
              </div>

              <div className="pricing-line">
                <span>Indemnité d’entretien</span>
                <strong>{item.maintenance_fee} €</strong>
              </div>

              <div className="pricing-line">
                <span>Indemnité repas</span>
                <strong>{item.meal_fee} €</strong>
              </div>

              <hr />

              <p>
                <strong>Modalités :</strong><br />
                {item.payment_terms || "Non renseignées"}
              </p>

              <p className="mb-0">
                <strong>Aide CAF :</strong><br />
                {item.caf_info || "Non renseignée"}
              </p>
            </div>
          ))}
        </div>

        {/* COLONNE DROITE : SIMULATION */}
        <div className="col-lg-6">
          <h2 className="mb-3">Estimation d’aide</h2>

          <div className="pricing-simulator-card">
            <p className="text-muted">
              Cette simulation permet d’estimer le coût mensuel après aide CAF.
            </p>

            <div className="mb-3">
              <label className="form-label">Heures par semaine</label>
              <input
                type="number"
                className="form-control"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Taux horaire (€)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Aide CAF estimée (€)</label>
              <input
                type="number"
                className="form-control"
                value={cafAid}
                onChange={(e) => setCafAid(Number(e.target.value))}
              />
            </div>

            <div className="simulator-result mt-3">
              <span>Heures mensuelles</span>
              <strong>{monthlyHours} h</strong>
            </div>

            <div className="simulator-result mt-3">
              <span>Coût brut estimé</span>
              <strong>{grossMonthly.toFixed(2)} €</strong>
            </div>

            <div className="simulator-result result-important mt-3">
              <span>Reste à charge</span>
              <strong>{estimatedBalance.toFixed(2)} €</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;