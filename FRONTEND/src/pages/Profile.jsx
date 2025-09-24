import React from "react";

function Profile() {
  return (
    <main>
      <div className="page-container">
        <div className="profile-header">
          <img src="/student-photo.jpg" alt="Student Photo" />
          <h1>Thabo Mokoena</h1>
          <p>Founder & CEO of ThaboTech Solutions</p>
        </div>

        <div className="business-info">
          <h2>About the Business</h2>
          <p>ThaboTech Solutions is a student-run tech startup focused on providing affordable web development and digital marketing services to small businesses in Gauteng. Founded in 2024, the company has helped over 30 local entrepreneurs establish their online presence.</p>

          <h2>Services Offered</h2>
          <ul>
            <li>Website Design & Development</li>
            <li>Social Media Management</li>
            <li>SEO Optimization</li>
            <li>Graphic Design</li>
          </ul>
        </div>

        <div className="contact">
          <p>📧 Email: <a href="mailto:thabo@thabotech.co.za">thabo@thabotech.co.za</a></p>
          <p>🌐 Website: <a href="https://www.thabotech.co.za">www.thabotech.co.za</a></p>
        </div>
      </div>
    </main>
  );
}

export default Profile;
