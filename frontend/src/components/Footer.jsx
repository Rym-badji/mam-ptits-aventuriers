import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container text-center">

        <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">

          <span>M.A.M Des P'tits Aventuriers</span>

          <span>© 2026</span>

          <Link className="text-white" to="/faq">
            FAQ
          </Link>

          <Link className="text-white" to="/mentions-legales">
            Mentions légales & RGPD
          </Link>

        </div>

      </div>
    </footer>
  );
}

export default Footer;