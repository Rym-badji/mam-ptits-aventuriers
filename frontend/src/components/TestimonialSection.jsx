import { useEffect, useState } from "react";
import api from "../api/axios";

function TestimonialSection() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get("testimonials/")
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="container py-5">
      <h2 className="section-title text-center mb-4">Avis des parents</h2>
      <div className="row g-4">
        {testimonials.map((item) => (
          <div className="col-md-4" key={item.id}>
            <div className="card h-100 shadow-sm border-0 testimonial-card">
              <div className="card-body">
                <div className="mb-2 fs-5">
                  {"★".repeat(item.rating)}
                </div>
                <p className="mb-3">“{item.comment}”</p>
                <p className="fw-bold mb-0">{item.parent_name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialSection;