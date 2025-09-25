import React from "react";

function Profile() {
  return (
    <div className="page-container">
      <section className="hero">
        <h2>Your Profile</h2>
        <p>Manage your listings, view messages, and update information.</p>
      </section>

      <div className="grid">
        <div className="card">
          <div className="card-content">
            <h4>Profile Info</h4>
            <p>Name: Thabo Mokoena</p>
            <p>Email: thabo@thabotech.co.za</p>
            <p>Role: Student Seller</p>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h4>Your Listings</h4>
            <p>No active listings yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
