import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function ManageSectionsPage() {
  const { accessToken } = useContext(AuthContext);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    page: "",
    title: "",
    slug: "",
    content: "",
    order: 0,
    editable_by_assistants: true,
  });

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const loadSections = async () => {
    const res = await api.get("admin/sections/", authHeaders);
    setSections(res.data);
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEdit = (section) => {
    setFormData({
      id: section.id,
      page: section.page,
      title: section.title,
      slug: section.slug,
      content: section.content,
      order: section.order,
      editable_by_assistants: section.editable_by_assistants,
    });
  };

  const resetForm = () => {
    setFormData({
      id: null,
      page: "",
      title: "",
      slug: "",
      content: "",
      order: 0,
      editable_by_assistants: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.id) {
      await api.put(`admin/sections/${formData.id}/`, formData, authHeaders);
    } else {
      await api.post("admin/sections/", formData, authHeaders);
    }

    resetForm();
    loadSections();
  };

  const handleDelete = async (id) => {
    await api.delete(`admin/sections/${id}/`, authHeaders);
    loadSections();
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Gérer les sections</h1>

      <div className="row">
        <div className="col-md-5">
          <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
            <div className="mb-3">
              <label className="form-label">ID Page</label>
              <input
                type="number"
                className="form-control"
                name="page"
                value={formData.page}
                onChange={handleChange}
                required
              />
            </div>

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
                rows="6"
                name="content"
                value={formData.content}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Ordre</label>
              <input
                type="number"
                className="form-control"
                name="order"
                value={formData.order}
                onChange={handleChange}
              />
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                name="editable_by_assistants"
                checked={formData.editable_by_assistants}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Modifiable par les assistantes
              </label>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">
                {formData.id ? "Modifier" : "Créer"}
              </button>
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Réinitialiser
              </button>
            </div>
          </form>
        </div>

        <div className="col-md-7">
          <div className="card p-3 shadow-sm">
            <h2 className="mb-3">Liste des sections</h2>
            {sections.map((section) => (
              <div key={section.id} className="border rounded p-3 mb-3">
                <h5>{section.title}</h5>
                <p className="mb-1"><strong>Slug :</strong> {section.slug}</p>
                <p className="mb-1"><strong>Page ID :</strong> {section.page}</p>
                <p className="mb-1"><strong>Ordre :</strong> {section.order}</p>
                <p>{section.content}</p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(section)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(section.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageSectionsPage;