const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Generic fetch wrapper
export async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }

  return res.json();
}

// Named export: postAPI
export async function postAPI(endpoint, data) {
  return fetchAPI(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Users
export async function getUser() {
  return fetchAPI("users/me");
}

export async function updateUser(data) {
  return fetchAPI("users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Listings
export async function getListings() {
  return fetchAPI("listings");
}

export async function createListing(data) {
  return fetchAPI("listings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Default export ---
export default {
  fetchAPI,
  postAPI,
  getUser,
  updateUser,
  getListings,
  createListing,
};
