import { useEffect, useState } from "react";
import api from "../api/axios";
import PublicPageRenderer from "../components/PublicPageRenderer";
import TestimonialSection from "../components/TestimonialSection";

function HomePage() {
  const [homePage, setHomePage] = useState(null);

  const loadHomePage = () => {
    api.get("pages/accueil/")
      .then((res) => setHomePage(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadHomePage();
  }, []);

  return (
    <>
      <section className="hero-section d-flex align-items-center">
        <div className="container text-center">

            <h1 className="hero-title">M.A.M Des P'tits Aventuriers</h1>


            <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
              <a href="/contact" className="btn btn-primary btn-lg">
                Demande de place
              </a>
              <a href="/contact" className="btn btn-outline-light btn-lg">
                Nous contacter
              </a>
            </div>

        </div>
      </section>

      <section className="container py-5">
        <h2 className="section-title text-center mb-4">Nos points forts</h2>
        <div className="row g-4">
          <div className="col-6 col-md-3">
            <div className="feature-card">🏰 Accueil bienveillant</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="feature-card">🌿 Éveil à la nature</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="feature-card">📜 Accompagnement personnalisé</div>
          </div>
          <div className="col-6 col-md-3">
            <div className="feature-card">🛡️ Cadre sécurisé</div>
          </div>
        </div>
      </section>

      <PublicPageRenderer page={homePage} onRefresh={loadHomePage} />

      <TestimonialSection />
    </>
  );
}

export default HomePage;