import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // ✅ import your Auth context

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Notification from "./components/Notification";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import AboutPage from "./pages/AboutPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NotFoundPage from "./pages/NotFoundPage";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import CheckoutPage from "./pages/CheckoutPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import CreateListing from "./pages/CreateListing";
import Dashboard from "./components/Dashboard"; 

// ProtectedRoute updated to redirect not-logged-in users to /signin
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/signin" replace />;
};

// 🟣 Admin Dashboard & Analytics
import AdminDashboard from "./components/Admin/AdminDashboard";
import AnalyticsPage from "./components/Admin/AnalyticsPage";

function App() {
  const [cart, setCart] = useState([
    { id: 1, title: "Intro to Algorithms", price: 250, image: "/uploads/book1.jpeg" },
    { id: 2, title: "Economics Notes", price: 100, image: "/uploads/book2.jpeg" },
  ]);

  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useAuth(); // ✅ use currentUser from context

  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Router>
      <Navbar cartCount={cart.length} wishlistCount={wishlist.length} />
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route
            path="/marketplace"
            element={
              <Marketplace
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* NWU OAuth callback */}
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

          {/* Protected pages */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile cart={cart} wishlist={wishlist} user={currentUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage cart={cart} setCart={setCart} addNotification={addNotification} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart cart={cart} setCart={setCart} addNotification={addNotification} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist wishlist={wishlist} setWishlist={setWishlist} addNotification={addNotification} />
              </ProtectedRoute>
            }
          />

          {/* ✅ Create Listing Page */}
          <Route
            path="/create-listing"
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            }
          />

          {/* ✅ User Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Order flow */}
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />

          {/* 🟣 Admin Panel */}
          <Route
            path="/admin"
            element={
              currentUser?.role === "admin" ? (
                <AdminDashboard user={currentUser} />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
          <Route
            path="/admin/analytics"
            element={
              currentUser?.role === "admin" ? (
                <AnalyticsPage />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />

          {/* Catch all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Notifications */}
      <div className="notifications-container fixed top-5 right-5 z-50 space-y-2">
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
