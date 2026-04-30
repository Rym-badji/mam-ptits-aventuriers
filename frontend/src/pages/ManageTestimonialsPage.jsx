import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function ManageTestimonialsPage() {
  const { accessToken } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    parent_name: "",
    rating: 5,
    comment: "",
    is_published: true,
  });

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const loadTestimonials = async () => {
    const res = await api.get("admin/testimonials/", authHeaders);
    setItems(res.data);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("admin/testimonials/", formData, authHeaders);
    setFormData({
      parent_name: "",
      rating: 5,
      comment: "",
      is_published: true,
    });
    loadTestimonials();
  };

  const handleDelete = async (id) => {
    await api.delete(`admin/testimonials/${id}/`, authHeaders);
    loadTestimonials();
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Gérer les témoignages</h1>

      <div className="row">
        <div className="col-md-5">
          <form className="card p-4 shadow-sm border-0" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom du parent</label>
              <input
                type="text"
                className="form-control"
                value={formData.parent_name}
                onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Note</label>
              <input
                type="number"
                className="form-control"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Commentaire</label>
              <textarea
                className="form-control"
                rows="5"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              />
              <label className="form-check-label">Publié</label>
            </div>

            <button className="btn btn-primary">Ajouter</button>
          </form>
        </div>

        <div className="col-md-7">
          <div className="card p-4 shadow-sm border-0">
            <h2 className="h4 mb-3">Liste</h2>
            {items.map((item) => (
              <div key={item.id} className="border rounded p-3 mb-3">
                <p className="mb-1"><strong>{item.parent_name}</strong></p>
                <p className="mb-1">Note : {item.rating}/5</p>
                <p>{item.comment}</p>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageTestimonialsPage;