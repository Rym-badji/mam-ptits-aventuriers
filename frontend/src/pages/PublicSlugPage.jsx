import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import PublicPageRenderer from "../components/PublicPageRenderer";

function PublicSlugPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");

  const loadPage = () => {
    api.get(`pages/${slug}/`)
      .then((res) => {
        setPage(res.data);
        setError("");
      })
      .catch(() => {
        setError("Page introuvable");
      });
  };

  useEffect(() => {
    loadPage();
  }, [slug]);

  if (error) {
    return (
      <div className="container py-5">
        <h1>{error}</h1>
      </div>
    );
  }

  return <PublicPageRenderer page={page} onRefresh={loadPage} />;
}

export default PublicSlugPage;