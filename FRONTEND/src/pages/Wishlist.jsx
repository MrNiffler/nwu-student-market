import React from "react";

function Wishlist({ wishlist, setWishlist, cart, setCart }) {
  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const moveToCart = (item) => {
    if (!cart.find((i) => i.id === item.id)) {
      setCart([...cart, item]);
      alert(`${item.title} moved to cart 🛒`);
    } else {
      alert(`${item.title} is already in your cart!`);
    }
    removeFromWishlist(item.id);
  };

  return (
    <div className="page-container">
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {wishlist.map((item) => (
            <li key={item.id}>
              {item.title} - R{item.price}
              <button onClick={() => moveToCart(item)}>Move to Cart</button>
              <button onClick={() => removeFromWishlist(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Wishlist;
