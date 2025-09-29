import React, { useState, useEffect } from "react";

function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white text-sm transition-opacity duration-200 ${
        type === "success" ? "bg-green-500" :
        type === "error" ? "bg-red-500" :
        "bg-blue-500"
      }`}
    >
      {message}
    </div>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Fetch products
  useEffect(() => {
    fetch("dummyData.json")
      .then((resp) => {
        if (!resp.ok) throw new Error("Failed to fetch data");
        return resp.json();
      })
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        addNotification("Products loaded successfully!", "success");
      })
      .catch((err) => {
        console.error("Could not load dummy data:", err);
        addNotification("Failed to load products. Please try again.", "error");
      });
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredProducts(products);
      addNotification("Showing all products.", "info");
      return;
    }

    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);

    if (filtered.length === 0) {
      addNotification("No products match your search.", "info");
    } else {
      addNotification(`Found ${filtered.length} product(s).`, "success");
    }
  };

  return (
    <div className="page-container max-w-5xl mx-auto px-4">
      <section className="hero text-center py-10 bg-gradient-to-b from-white to-gray-50 rounded-lg my-5">
        <h2 className="text-2xl font-bold mb-2">
          Buy, sell and trade safely with fellow NWU students
        </h2>
        <p className="text-gray-600">
          Verified access, private messaging, and student-only listings.
        </p>
      </section>

      <section className="controls my-6 flex justify-center">
        <input
          className="search-bar w-full max-w-xl p-2 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="search"
          placeholder="Search listings (title, category)..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </section>

      <section className="listings my-8">
        <h3 className="text-xl font-semibold mb-4">Featured Listings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-600">No listings found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="card bg-white rounded-lg p-3 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                onClick={() => addNotification(`Viewing: ${product.title}`, "success")}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="card-content mt-2">
                  <h4 className="font-bold text-base">{product.title}</h4>
                  <p className="text-indigo-700 font-bold text-lg">{product.price}</p>
                  <p className="text-sm text-gray-600">Category: {product.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

export default Home;