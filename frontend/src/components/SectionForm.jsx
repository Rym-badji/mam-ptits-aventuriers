import { useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function SectionForm({ pageId, initialData = null, onSuccess, onCancel }) {
  const { accessToken } = useContext(AuthContext);
  const token = accessToken || localStorage.getItem("accessToken");

  const [formData, setFormData] = useState({
    page: pageId,
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    order: initialData?.order || 1,
    editable_by_assistants: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      slug: name === "title" && !initialData ? slugify(value) : prev.slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (initialData) {
      await api.put(`admin/sections/${initialData.id}/`, formData, { headers });
    } else {
      await api.post("admin/sections/", formData, { headers });
    }

    onSuccess();
  };

  return (
    <form className="card p-4 shadow-sm border-0 mb-4" onSubmit={handleSubmit}>
      <h3 className="h5 mb-3">
        {initialData ? "Modifier la section" : "Ajouter une section"}
      </h3>

      <div className="mb-3">
        <label className="form-label">Titre</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Slug</label>
        <input
          type="text"
          className="form-control"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contenu</label>
        <textarea
          className="form-control"
          rows="5"
          name="content"
          value={formData.content}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Ordre d’affichage</label>
        <input
          type="number"
          className="form-control"
          name="order"
          value={formData.order}
          onChange={handleChange}
        />
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary" type="submit">
          {initialData ? "Enregistrer" : "Ajouter"}
        </button>

        {onCancel && (
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

export default SectionForm;