import React from "react";

function Home() {
  return (
    <main>
      <div className="page-container">
        <section className="hero">
          <h2>Buy, sell and trade safely with fellow NWU students</h2>
          <p>Verified access, private messaging and student-only listings.</p>
        </section>

        <section className="controls">
          <input type="search" placeholder="Search listings (title, category)..." />
        </section>

        <section className="listings">
          <h3>Featured Listings</h3>
          <div className="grid">
            {/* Dummy cards */}
            {[1,2,3,4].map((i) => (
              <div key={i} className="card">
                <img src={`https://picsum.photos/300/200?random=${i}`} alt={`Product ${i}`} />
                <h3>Product {i}</h3>
                <p>Some description about product {i}</p>
                <p><strong>R{i * 100}</strong></p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
