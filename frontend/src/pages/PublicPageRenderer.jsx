import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import SectionForm from "./SectionForm";
import { getMediaUrl } from "../utils/media";

function PublicPageRenderer({ page, onRefresh }) {
  const { accessToken, user, setUser } = useContext(AuthContext);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [currentUser, setCurrentUser] = useState(user);

  const token = accessToken || localStorage.getItem("accessToken");

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      return;
    }

    if (token) {
      api.get("me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCurrentUser(res.data);
        if (setUser) {
          setUser(res.data);
        }
      })
      .catch((err) => {
        console.error("Erreur récupération utilisateur :", err);
      });
    }
  }, [token, user, setUser]);

  if (!page) {
    return <p className="container py-5">Chargement...</p>;
  }

  const role = currentUser?.role;
  const isAdmin = role === "admin";
  const isAssistant = role === "assistante";

  const canAddSection = isAdmin || isAssistant;
  const canEditSection = isAdmin;

  const sectionColors = [
    "section-card-parchment",
    "section-card-green",
    "section-card-gold",
    "section-card-red",
    "section-card-blue",
  ];

  const getSectionColorClass = (index) => {
    return sectionColors[index % sectionColors.length];
  };

  const handleDelete = async (sectionId) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette section ?"
    );

    if (!confirmDelete) return;

    await api.delete(`admin/sections/${sectionId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    onRefresh();
  };

  return (
    <div className="container py-5">

      <div className="mb-4">
        <h1 className="mb-3">{page.title}</h1>
        {page.intro && <p className="lead">{page.intro}</p>}
      </div>

      {/* Zone de contrôle visible si connecté */}
      {canAddSection && (
        <div className="mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Fermer le formulaire" : "Ajouter une section"}
          </button>
        </div>
      )}

      {/* Formulaire d’ajout */}
      {showAddForm && (
        <SectionForm
          pageId={page.id}
          onSuccess={() => {
            setShowAddForm(false);
            onRefresh();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Sections */}
      {page.sections && page.sections.length > 0 ? (
        <div className="row g-4">
          {page.sections.map((section, index) => (
            <div className="col-12" key={section.id}>
              {editingSection?.id === section.id ? (
                <SectionForm
                  pageId={page.id}
                  initialData={section}
                  onSuccess={() => {
                    setEditingSection(null);
                    onRefresh();
                  }}
                  onCancel={() => setEditingSection(null)}
                />
              ) : (
                <div
                  className={`card section-card ${getSectionColorClass(index)}`}
                >
                  {section.images && section.images.length > 0 && (
                    <img
                      src={getMediaUrl(section.images[0].image)}
                      className="card-img-top"
                      alt={section.images[0].alt_text || section.title}
                    />
                  )}

                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                      <h2 className="h4 mb-3">{section.title}</h2>

                      {canEditSection && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => setEditingSection(section)}
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
                      )}
                    </div>

                    {section.content && (
                      <p style={{ whiteSpace: "pre-line" }}>
                        {section.content}
                      </p>
                    )}

                    {section.images && section.images.length > 1 && (
                      <div className="row g-3 mt-3">
                        {section.images.slice(1).map((img) => (
                          <div className="col-md-4" key={img.id}>
                            <img
                              src={getMediaUrl(img.image)}
                              className="img-fluid rounded shadow-sm"
                              alt={img.alt_text || section.title}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-warning">
          Aucune section n’a encore été ajoutée à cette page.
        </div>
      )}
    </div>
  );
}

export default PublicPageRenderer;