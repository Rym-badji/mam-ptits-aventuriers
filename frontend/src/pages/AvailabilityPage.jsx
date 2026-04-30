import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function AvailabilityPage() {
  const { accessToken, user } = useContext(AuthContext);
  const token = accessToken || localStorage.getItem("accessToken");
  const role = user?.role || localStorage.getItem("userRole");

  const isAdmin = role === "admin";
  const isAssistant = role === "assistante";
  const canAdd = isAdmin || isAssistant;
  const canEdit = isAdmin || isAssistant;
  const canDelete = isAdmin;

  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    age_group: "",
    available_places: 0,
    start_date: "",
    notes: "",
    is_waiting_list_open: false,
  });

  const loadItems = () => {
    api.get("availabilities/")
      .then((res) => setItems(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const resetForm = () => {
    setFormData({
      age_group: "",
      available_places: 0,
      start_date: "",
      notes: "",
      is_waiting_list_open: false,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      age_group: item.age_group,
      available_places: item.available_places,
      start_date: item.start_date,
      notes: item.notes || "",
      is_waiting_list_open: item.is_waiting_list_open,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (editingItem) {
      await api.put(`admin/availabilities/${editingItem.id}/`, formData, { headers });
    } else {
      await api.post("admin/availabilities/", formData, { headers });
    }

    resetForm();
    loadItems();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette disponibilité ?")) return;

    await api.delete(`admin/availabilities/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadItems();
  };

  return (
    <div className="container py-5">
      <div className="page-header-medieval mb-5">
        <div>
          <h1>Disponibilités</h1>
          <p className="lead">Consultez les places disponibles et les périodes d’accueil possibles.</p>
        </div>

        {canAdd && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Fermer" : "Ajouter une disponibilité"}
          </button>
        )}
      </div>

      {showForm && (
        <form className="card p-4 shadow-sm border-0 mb-4" onSubmit={handleSubmit}>
          <h2 className="h5 mb-3">{editingItem ? "Modifier la disponibilité" : "Ajouter une disponibilité"}</h2>

          <div className="mb-3">
            <label className="form-label">Âge concerné</label>
            <input className="form-control" value={formData.age_group} onChange={(e) => setFormData({ ...formData, age_group: e.target.value })} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Places disponibles</label>
            <input type="number" className="form-control" value={formData.available_places} onChange={(e) => setFormData({ ...formData, available_places: e.target.value })} />
          </div>

          <div className="mb-3">
            <label className="form-label">Date de disponibilité</label>
            <input type="date" className="form-control" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Notes</label>
            <textarea className="form-control" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={formData.is_waiting_list_open}
              onChange={(e) => setFormData({ ...formData, is_waiting_list_open: e.target.checked })}
            />
            <label className="form-check-label">Liste d’attente ouverte</label>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary">{editingItem ? "Enregistrer" : "Ajouter"}</button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Annuler</button>
          </div>
        </form>
      )}

      <div className="row g-3">
        {items.map((item, index) => (
          <div className="col-md-6 col-lg-4" key={item.id}>
            <div
              className={`availability-card ${index % 2 === 0 ? "section-card-green" : "section-card-parchment"}`}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h3 className="h6 mb-0">{item.age_group}</h3>

                {(canEdit || canDelete) && (
                  <div className="d-flex gap-1">
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

              <p className="mb-1">
                <strong>Places :</strong> {item.available_places}
              </p>

              <p className="mb-1">
                <strong>Date :</strong> {item.start_date}
              </p>

              <p className="mb-1">
                <strong>Liste d’attente :</strong>{" "}
                {item.is_waiting_list_open ? "Oui" : "Non"}
              </p>

              {item.notes && (
                <p className="mb-0 small text-muted">{item.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailabilityPage;