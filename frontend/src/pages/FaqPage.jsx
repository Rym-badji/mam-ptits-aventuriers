import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function FaqPage() {
  const { accessToken, user } = useContext(AuthContext);
  const token = accessToken || localStorage.getItem("accessToken");
  const role = user?.role || localStorage.getItem("userRole");

  const isAdmin = role === "admin";
  const isAssistant = role === "assistante";
  const canAdd = isAdmin || isAssistant;
  const canEdit = isAdmin || isAssistant;
  const canDelete = isAdmin;

  const [faq, setFaq] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    order: 0,
    is_published: true,
  });

  const loadFaq = () => {
    api.get("faq/")
      .then((res) => setFaq(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadFaq();
  }, []);

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      order: 0,
      is_published: true,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      order: item.order,
      is_published: item.is_published,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (editingItem) {
      await api.put(`admin/faq/${editingItem.id}/`, formData, { headers });
    } else {
      await api.post("admin/faq/", formData, { headers });
    }

    resetForm();
    loadFaq();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette question ?")) return;

    await api.delete(`admin/faq/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadFaq();
  };

  return (
    <div className="container py-5">
      <div className="page-header-medieval mb-5">
        <div>
          <h1>FAQ</h1>
          <p className="lead">Les réponses aux questions fréquentes des familles.</p>
        </div>

        {canAdd && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Fermer" : "Ajouter une question"}
          </button>
        )}
      </div>

      {showForm && (
        <form className="card p-4 shadow-sm border-0 mb-4" onSubmit={handleSubmit}>
          <h2 className="h5 mb-3">{editingItem ? "Modifier la question" : "Ajouter une question"}</h2>

          <div className="mb-3">
            <label className="form-label">Question</label>
            <input className="form-control" value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Réponse</label>
            <textarea className="form-control" rows="5" value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Ordre</label>
            <input type="number" className="form-control" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} />
          </div>

          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} />
            <label className="form-check-label">Publié</label>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary">{editingItem ? "Enregistrer" : "Ajouter"}</button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Annuler</button>
          </div>
        </form>
      )}

      <div className="accordion faq-accordion" id="faqAccordion">
        {faq.map((item, index) => (
          <div className="accordion-item faq-item" key={item.id}>
            <h2 className="accordion-header" id={`heading-${item.id}`}>
              <button
                className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${item.id}`}
                aria-expanded={index === 0 ? "true" : "false"}
                aria-controls={`collapse-${item.id}`}
              >
                {item.question}
              </button>
            </h2>

            <div
              id={`collapse-${item.id}`}
              className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
              aria-labelledby={`heading-${item.id}`}
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                <p>{item.answer}</p>

                {(canEdit || canDelete) && (
                  <div className="d-flex gap-2 mt-3">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaqPage;