import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

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

// Admin Components
import AdminDashboard from "./components/Admin/AdminDashboard";
import AnalyticsPage from "./components/Admin/AnalyticsPage";
import AdminListingsPage from "./components/Admin/AdminListingsPage";
import AdminOrdersPage from "./components/Admin/AdminOrdersPage";
import AdminUsersPage from "./components/Admin/AdminUsersPage";

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, loadingUser } = useAuth();

  if (loadingUser) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/signin" replace />;

  if (role && currentUser.role !== role) {
    if (currentUser.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const [cart, setCart] = useState([
    { id: 1, title: "Intro to Algorithms", price: 250, image: "/uploads/book1.jpeg" },
    { id: 2, title: "Economics Notes", price: 100, image: "/uploads/book2.jpeg" },
  ]);

  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { fetchCurrentUser } = useAuth();

  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

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
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

          {/* Protected pages */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile cart={cart} wishlist={wishlist} />
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
          <Route
            path="/create-listing"
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard addNotification={addNotification} />
              </ProtectedRoute>
            }
          >
            <Route index element={<AnalyticsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="listings" element={<AdminListingsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            {/* ✅ Updated: Pass addNotification here */}
            <Route path="users" element={<AdminUsersPage addNotification={addNotification} />} />
          </Route>

          {/* Order flow */}
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />

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
