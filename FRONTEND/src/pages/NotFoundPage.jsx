import React from "react";

export default function NotFoundPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        margin: 0,
        background: "var(--bg, #f4f7fb)",
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: "center",
      }}
    >
      <div className="error" style={{ fontSize: "6rem", fontWeight: 700, color: "var(--primary, #4b6ef5)" }}>
        404
      </div>
      <div className="message" style={{ fontSize: "1.25rem", color: "var(--muted, #5c667a)", marginBottom: "20px" }}>
        Oops! The page you’re looking for doesn’t exist.
      </div>
      <a
        href="/"
        className="btn"
        style={{
          padding: "12px 20px",
          borderRadius: "8px",
          border: "none",
          background: "var(--primary, #4b6ef5)",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        Go Back Home
      </a>
    </div>
  );
}
