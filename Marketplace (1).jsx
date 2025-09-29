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

function Spinner() {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="w-12 h-12 border-4 border-t-4 border-indigo-800 border-solid rounded-full animate-spin"></div>
    </div>
  );
}

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Simulate fetching products
  useEffect(() => {
    setLoading(true);
    fetch("dummyData.json") 
      .then((resp) => {
        if (!resp.ok) throw new Error("Failed to fetch data");
        return resp.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
        addNotification("Products loaded successfully!", "success");
      })
      .catch((err) => {
        console.error("Could not load products:", err);
        setLoading(false);
        addNotification("Failed to load products. Please try again.", "error");
      });
  }, []);

  return (
    <div className="page-container max-w-5xl mx-auto px-4">
      <section className="hero text-center py-10 bg-gradient-to-b from-white to-gray-50 rounded-lg my-5">
        <h2 className="text-2xl font-bold mb-2">Marketplace</h2>
        <p className="text-gray-600">Browse all listings below:</p>
      </section>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.length === 0 ? (
            <p className="text-gray-600">No listings found.</p>
          ) : (
            products.map((product) => (
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
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-indigo-700 font-bold text-lg">R{product.price}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

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

export default Marketplace;