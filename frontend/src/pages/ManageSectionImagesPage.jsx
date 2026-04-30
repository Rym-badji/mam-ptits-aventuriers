import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function ManageSectionImagesPage() {
  const { accessToken } = useContext(AuthContext);
  const [sections, setSections] = useState([]);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    section: "",
    alt_text: "",
    caption: "",
    order: 0,
  });
  const [file, setFile] = useState(null);

  const tokenHeader = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const loadData = async () => {
    const sectionsRes = await api.get("admin/sections/", tokenHeader);
    const imagesRes = await api.get("admin/section-images/", tokenHeader);
    setSections(sectionsRes.data);
    setImages(imagesRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("section", formData.section);
    data.append("alt_text", formData.alt_text);
    data.append("caption", formData.caption);
    data.append("order", formData.order);
    if (file) {
      data.append("image", file);
    }

    await api.post("admin/section-images/", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setFormData({
      section: "",
      alt_text: "",
      caption: "",
      order: 0,
    });
    setFile(null);
    loadData();
  };

  const handleDelete = async (id) => {
    await api.delete(`admin/section-images/${id}/`, tokenHeader);
    loadData();
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Gérer les images des sections</h1>

      <div className="row">
        <div className="col-md-5">
          <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Section</label>
              <select
                className="form-select"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                required
              >
                <option value="">Choisir une section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Texte alternatif</label>
              <input
                type="text"
                className="form-control"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Légende</label>
              <input
                type="text"
                className="form-control"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Ordre</label>
              <input
                type="number"
                className="form-control"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              />
            </div>

            <button className="btn btn-primary">Ajouter l’image</button>
          </form>
        </div>

        <div className="col-md-7">
          <div className="card p-4 shadow-sm">
            <h2 className="mb-3">Images existantes</h2>
            <div className="row g-3">
              {images.map((img) => (
                <div className="col-md-6" key={img.id}>
                  <div className="card h-100">
                    <img
                      src={`http://127.0.0.1:8000${img.image}`}
                      className="card-img-top"
                      alt={img.alt_text || ""}
                    />
                    <div className="card-body">
                      <p><strong>Section ID :</strong> {img.section}</p>
                      <p><strong>Légende :</strong> {img.caption}</p>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(img.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageSectionImagesPage;