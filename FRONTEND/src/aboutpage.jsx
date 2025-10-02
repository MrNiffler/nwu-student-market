import React from "react";

export default function AboutPage() {
  // simple handler for buttons
  const showAlert = (action) => {
    alert(`You clicked to ${action}!`);
  };

  return (
    <div className="container">
      <header>
        <div className="brand">
          <div className="logo">BN</div>
          <div>
            <h1>ThaboTech</h1>
            <p className="lead">Innovating • Delivering • Growing</p>
          </div>
        </div>
        <nav className="socials" aria-label="Quick links">
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="card" id="about">
          <div className="hero">
            <div className="avatar" aria-hidden="true">
              BN
            </div>
            <div className="bio">
              <h2>About Us</h2>
              <p>
                Thabo Tech is committed to providing top-quality services and
                innovative solutions that drive value and growth for our clients.
                We combine expertise, creativity, and technology to deliver
                results.
              </p>

              <div className="tags" aria-hidden="true">
                <span className="tag">Innovation</span>
                <span className="tag">Customer Focus</span>
                <span className="tag">Excellence</span>
                <span className="tag">Sustainability</span>
              </div>
            </div>
          </div>

          <div className="section" id="services">
            <h3>Our Services</h3>
            <ul>
              <li>
                <strong>Consulting</strong> — Tailored strategies and insights to
                grow your business.
              </li>
              <li>
                <strong>Technology Solutions</strong> — Cutting-edge tools to
                enhance efficiency and security.
              </li>
              <li>
                <strong>Creative Media</strong> — Professional content to elevate
                your brand presence.
              </li>
            </ul>
          </div>

          <div className="section">
            <h3>Our Journey</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="dot" aria-hidden="true"></div>
                <div>
                  <strong>2020</strong> — Founded with a mission to bring
                  innovation to small businesses.
                </div>
              </div>
              <div className="timeline-item">
                <div className="dot" aria-hidden="true"></div>
                <div>
                  <strong>2022</strong> — Expanded services into technology and
                  creative solutions.
                </div>
              </div>
              <div className="timeline-item">
                <div className="dot" aria-hidden="true"></div>
                <div>
                  <strong>2025</strong> — Continuing to grow, focusing on
                  sustainability and impact.
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="contact-card card" id="contact">
          <h3>Contact Us</h3>
          <p className="muted">
            We’d love to hear from you. Reach out to collaborate or learn more
            about our services.
          </p>

          <div className="section">
            <a className="socials" href="mailto:info@business.com">
              Email
            </a>
          </div>

          <div className="section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#">LinkedIn</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
            </div>
          </div>

          <div className="section">
            <h3>Quick Actions</h3>
            <div className="cta">
              <button
                className="btn btn-primary"
                onClick={() => showAlert("collaborate")}
              >
                Collaborate
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => showAlert("download profile")}
              >
                Download Profile
              </button>
            </div>
          </div>

          <footer style={{ marginTop: "18px" }}>
            &copy; 2025 ThaboTech. All rights reserved.
          </footer>
        </aside>
      </main>
    </div>
  );
}
