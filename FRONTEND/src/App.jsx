import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

// Notification component (reusable)
function Notification({ message, type, onClose }) {
  useState(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Home />} />
          <Route
            path="/marketplace"
            element={
              <Marketplace
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
                addNotification={addNotification}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                setCart={setCart}
                addNotification={addNotification}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <Wishlist
                wishlist={wishlist}
                setWishlist={setWishlist}
                addNotification={addNotification}
              />
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <Footer />
    </Router>
  );
}

export default App;
