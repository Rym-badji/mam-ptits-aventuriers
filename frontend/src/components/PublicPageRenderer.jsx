import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import InlineSectionForm from "./InlineSectionForm";
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
        if (setUser) setUser(res.data);
      })
      .catch((err) => console.error("Erreur utilisateur :", err));
    }
  }, [token, user, setUser]);

  if (!page) {
    return <p className="container py-5">Chargement...</p>;
  }

  const role = currentUser?.role;
  const isAdmin = role === "admin";
  const isAssistant = role === "assistante";

  const canAdd = isAdmin || isAssistant;
  const canEdit = isAdmin || isAssistant;
  const canDelete = isAdmin;

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
      <div className="page-header-medieval mb-5">
        <div>
          <h1 className="mb-3">{page.title}</h1>
          {page.intro && <p className="lead">{page.intro}</p>}
        </div>

        {canAdd && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Fermer le formulaire" : "Ajouter une section"}
          </button>
        )}
      </div>

      {showAddForm && (
        <InlineSectionForm
          pageId={page.id}
          onSuccess={() => {
            setShowAddForm(false);
            onRefresh();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {page.sections && page.sections.length > 0 ? (
        <div className="sections-list">
          {page.sections.map((section, index) => (
            <div key={section.id} className="mb-4">
              {editingSection?.id === section.id ? (
                <InlineSectionForm
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
                  className={`section-horizontal-card ${getSectionColorClass(index)}`}
                >
                  <div className="section-horizontal-image">
                    {section.images && section.images.length > 0 ? (
                      <img
                        src={getMediaUrl(section.images[0].image)}
                        alt={section.images[0].alt_text || section.title}
                      />
                    ) : (
                      <div className="section-image-placeholder">
                        Aucune image
                      </div>
                    )}
                  </div>

                  <div className="section-horizontal-content">
                    <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                      <h2>{section.title}</h2>

                      {(canEdit || canDelete) && (
                        <div className="d-flex gap-2 flex-wrap">
                          {canEdit && (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => setEditingSection(section)}
                            >
                              Modifier
                            </button>
                          )}

                          {canDelete && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(section.id)}
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {section.content && (
                      <p style={{ whiteSpace: "pre-line" }}>
                        {section.content}
                      </p>
                    )}

                    {section.images && section.images.length > 1 && (
                      <div className="section-extra-images">
                        {section.images.slice(1).map((img) => (
                          <img
                            key={img.id}
                            src={getMediaUrl(section.images[0].image)}
                            alt={img.alt_text || section.title}
                          />
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