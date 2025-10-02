import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import NotFoundPage from "./NotFoundPage";
import AboutPage from "./AboutPage";

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  return (
    <Router>
      <Navbar cartCount={cart.length} wishlistCount={wishlist.length} />

      <main style={{ minHeight: "80vh", padding: "2rem" }}>
        <Routes>
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
          <Route 
            path="/profile" 
            element={<Profile />} 
          />
          <Route 
            path="/cart" 
            element={<Cart cart={cart} setCart={setCart} />} 
          />
          <Route 
            path="/wishlist" 
            element={<Wishlist wishlist={wishlist} setWishlist={setWishlist} />} 
          />
        </Routes>
      </main>

      <Footer />
    </Router>
  );

function App() {
  return <AboutPage />;
}

function App() {
  return <NotFoundPage />;
}
}

export default App;
