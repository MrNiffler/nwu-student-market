import React from "react";
import { Link } from "react-router-dom";
import studentPhoto from "../assets/student-photo.jpg"; // Add a placeholder photo here

function Profile({ cart, wishlist }) {
  // Example static student/business info
  const studentInfo = {
    name: "Thabo Mokoena",
    role: "Founder & CEO of ThaboTech Solutions",
    businessName: "ThaboTech Solutions",
    about: "ThaboTech Solutions is a student-run tech startup focused on providing affordable web development and digital marketing services to small businesses in Gauteng. Founded in 2024, the company has helped over 30 local entrepreneurs establish their online presence.",
    services: [
      "Website Design & Development",
      "Social Media Management",
      "SEO Optimization",
      "Graphic Design",
    ],
    email: "thabo@thabotech.co.za",
    website: "https://www.thabotech.co.za",
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          padding: "3rem 1rem",
        }}
      >
        <img
          src={studentPhoto}
          alt="Student"
          style={{ width: "120px", borderRadius: "50%" }}
        />
        <h2 style={{ fontFamily: "Poppins, sans-serif", color: "#6C63FF" }}>
          {studentInfo.name}
        </h2>
        <p style={{ color: "#1F2937", fontWeight: "500" }}>
          {studentInfo.role}
        </p>
      </section>

      {/* Business Info */}
      <section style={{ backgroundColor: "#EDE9FE", padding: "2rem", borderRadius: "10px", marginBottom: "2rem" }}>
        <h3 style={{ fontFamily: "Poppins, sans-serif", color: "#6C63FF" }}>
          About the Business
        </h3>
        <p style={{ color: "#1F2937" }}>{studentInfo.about}</p>

        <h3 style={{ fontFamily: "Poppins, sans-serif", color: "#6C63FF", marginTop: "1.5rem" }}>
          Services Offered
        </h3>
        <ul>
          {studentInfo.services.map((service, index) => (
            <li key={index} style={{ color: "#1F2937", marginBottom: "0.5rem" }}>
              {service}
            </li>
          ))}
        </ul>
      </section>

      {/* Contact Info */}
      <section style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p>
          📧 Email: <a href={`mailto:${studentInfo.email}`}>{studentInfo.email}</a>
        </p>
        <p>
          🌐 Website: <a href={studentInfo.website} target="_blank" rel="noopener noreferrer">{studentInfo.website}</a>
        </p>
      </section>

      {/* Cart & Wishlist Summary */}
      <section className="summary">
        <h3>Quick Links</h3>
        <ul>
          <li>
            <Link to="/cart" className="btn-primary">
              Go to Cart ({cart?.length || 0})
            </Link>
          </li>
          <li style={{ marginTop: "0.5rem" }}>
            <Link to="/wishlist" className="btn-primary">
              Go to Wishlist ({wishlist?.length || 0})
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Profile;
