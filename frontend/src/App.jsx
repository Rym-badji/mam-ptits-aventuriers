import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TeamPage from "./pages/TeamPage";
import PricingPage from "./pages/PricingPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ManageSectionsPage from "./pages/ManageSectionsPage";
import ManageSectionImagesPage from "./pages/ManageSectionImagesPage";
import MyProfilePage from "./pages/MyProfilePage";
import PublicSlugPage from "./pages/PublicSlugPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import ManageTestimonialsPage from "./pages/ManageTestimonialsPage";
import LegalPage from "./pages/LegalPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/equipe" element={<TeamPage />} />
                <Route path="/tarifs" element={<PricingPage />} />
                <Route path="/disponibilites" element={<AvailabilityPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/connexion" element={<LoginPage />} />

                <Route path="/page/:slug" element={<PublicSlugPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/dashboard/profil"
                    element={
                        <PrivateRoute>
                            <MyProfilePage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/dashboard/temoignages"
                    element={
                        <PrivateRoute>
                            <ManageTestimonialsPage />
                        </PrivateRoute>
                    }
                />

                <Route path="/mentions-legales" element={<LegalPage />} />
            </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;