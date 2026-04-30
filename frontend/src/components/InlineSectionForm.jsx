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

function InlineSectionForm({ pageId, initialData = null, onSuccess, onCancel }) {
  const { accessToken } = useContext(AuthContext);
  const token = accessToken || localStorage.getItem("accessToken");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    page: pageId,
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    order: initialData?.order || 1,
    editable_by_assistants: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState(initialData?.images?.[0]?.caption || "");

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
    setError("");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let sectionResponse;

      if (initialData) {
        sectionResponse = await api.put(
          `admin/sections/${initialData.id}/`,
          formData,
          { headers }
        );
      } else {
        sectionResponse = await api.post(
          "admin/sections/",
          formData,
          { headers }
        );
      }

      const sectionId = initialData ? initialData.id : sectionResponse.data.id;

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("section", sectionId);
        imageData.append("image", imageFile);
        imageData.append("alt_text", formData.title);
        imageData.append("caption", caption);
        imageData.append("order", 1);

        await api.post("admin/section-images/", imageData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      onSuccess();
    } catch (err) {
        console.error("Erreur modification section :", err);
        console.error("Status :", err.response?.status);
        console.error("Data :", err.response?.data);

        const status = err.response?.status;
        const data = err.response?.data;

        if (status === 403) {
          setError("Accès refusé : votre rôle ne permet pas de modifier cette section.");
        } else if (status === 401) {
          setError("Session expirée : veuillez vous reconnecter.");
        } else if (status === 400) {
          setError("Erreur dans le formulaire : " + JSON.stringify(data));
        } else {
          setError("Erreur lors de l’enregistrement.");
        }
    }
  };

  return (
    <form className="card p-4 shadow-sm border-0 mb-4" onSubmit={handleSubmit}>
      <h3 className="h5 mb-3">
        {initialData ? "Modifier la section" : "Ajouter une section"}
      </h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">Titre de la section</label>
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
        <label className="form-label">Paragraphe</label>
        <textarea
          className="form-control"
          rows="6"
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

      <hr />

      <div className="mb-3">
        <label className="form-label">
          {initialData ? "Ajouter une nouvelle photo" : "Photo de la section"}
        </label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        {initialData && (
          <small className="text-muted">
            Si vous ajoutez une nouvelle photo, elle sera associée à cette section.
          </small>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Légende</label>
        <input
          type="text"
          className="form-control"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary" type="submit">
          {initialData ? "Enregistrer" : "Ajouter"}
        </button>

        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}

export default InlineSectionForm;