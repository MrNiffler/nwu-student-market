// src/api/endpoints.js
import axios from "axios";

// ---------------------------
// Axios instance
// ---------------------------
const API_BASE_URL = "http://localhost:5000"; // Change this to your backend URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper to set JWT token in headers
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ---------------------------
// Authentication & Users
// ---------------------------
export const registerUser = (userData) =>
  api.post("/auth/register", userData);

export const loginUser = (credentials) =>
  api.post("/auth/login", credentials);

export const resetPassword = (email) =>
  api.post("/auth/reset-password", { email });

// Get all users (admin only)
export const getAllUsers = () => api.get("/users");

// Get, update, delete specific user
export const getUser = (userId) => api.get(`/users/${userId}`);
export const updateUser = (userId, userData) =>
  api.patch(`/users/${userId}`, userData);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

// Admin actions
export const approveListing = (listingId) =>
  api.post(`/admin/approve-listing/${listingId}`);
export const rejectListing = (listingId) =>
  api.post(`/admin/reject-listing/${listingId}`);
export const manageUser = (userId, action) =>
  api.post(`/admin/manage-user/${userId}`, { action });

// ---------------------------
// Listings
// ---------------------------
export const getAllListings = () => api.get("/listings");
export const getListing = (listingId) => api.get(`/listings/${listingId}`);
export const createListing = (listingData) => api.post("/listings", listingData);
export const updateListing = (listingId, listingData) =>
  api.patch(`/listings/${listingId}`, listingData);
export const deleteListing = (listingId) => api.delete(`/listings/${listingId}`);

// Listing images
export const uploadListingImages = (listingId, formData) =>
  api.post(`/listings/${listingId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteListingImage = (listingId, imageId) =>
  api.delete(`/listings/${listingId}/images/${imageId}`);

// ---------------------------
// Orders & Transactions
// ---------------------------
export const createTransaction = (transactionData) =>
  api.post("/transactions", transactionData);

export const updateTransactionStatus = (transactionId, status) =>
  api.patch(`/transactions/${transactionId}/status`, { status });

export const getTransaction = (transactionId) =>
  api.get(`/transactions/${transactionId}`);

export const createOrder = (orderData) => api.post("/orders", orderData);
export const getOrdersByUser = (userId) => api.get(`/orders/${userId}`);

// Optional bookings
export const createBooking = (bookingData) =>
  api.post("/bookings", bookingData);
export const getBookingsByUser = (userId) =>
  api.get(`/bookings/${userId}`);

// ---------------------------
// Search & Discovery
// ---------------------------
export const searchListings = (query) => api.get(`/search?q=${query}`);
export const filterListings = (filters) =>
  api.get("/search/filter", { params: filters });
export const sortListings = (sortBy) => api.get(`/search/sort?sort=${sortBy}`);

// ---------------------------
// Ratings & Reviews
// ---------------------------
export const createRating = (ratingData) => api.post("/ratings", ratingData);
export const getUserReviews = (userId) => api.get(`/users/${userId}/reviews`);
export const getListingReviews = (listingId) => api.get(`/ratings/${listingId}`);
export const getAverageRatingByUser = (userId) =>
  api.get(`/ratings/average/${userId}`);
export const getAverageRatingByListing = (listingId) =>
  api.get(`/ratings/average/${listingId}`);

// ---------------------------
// Messaging
// ---------------------------
export const sendMessage = (messageData) => api.post("/messages", messageData);
export const getMessages = (conversationId) =>
  api.get(`/messages/${conversationId}`);
export const getConversations = (userId) =>
  api.get(`/conversations/${userId}`);

// ---------------------------
// Wishlist (client-side placeholder)
// ---------------------------
// Wishlist is not implemented in the backend yet; use state in React for now
export const addToWishlist = (product) => {
  return Promise.resolve(product);
};
export const removeFromWishlist = (productId) => {
  return Promise.resolve(productId);
};

// ---------------------------
// Cart (client-side placeholder)
// ---------------------------
// Cart is also client-side; API integration can be added later if needed
export const addToCart = (product) => Promise.resolve(product);
export const removeFromCart = (productId) => Promise.resolve(productId);

export default api;
