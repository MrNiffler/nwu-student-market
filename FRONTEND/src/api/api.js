const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// -------------------------------
// Generic fetch wrapper
// -------------------------------
export async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const url = `${API_URL}/${endpoint}`;
  console.log("Fetching API:", url); // debug log

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API error:", errorText);
    throw new Error(errorText || "API request failed");
  }

  return res.json();
}

// -------------------------------
// Generic POST helper
// -------------------------------
export async function postAPI(endpoint, data) {
  return fetchAPI(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// -------------------------------
// Normal User functions
// -------------------------------
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

// -------------------------------
// Admin-specific functions
// -------------------------------
export async function getAllUsers() {
  return fetchAPI("admin/users");
}

// ✅ Update approveUser / rejectUser to use `status`
export async function approveUser(userId) {
  return fetchAPI(`admin/users/${userId}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ status: "active" }),
  });
}

export async function rejectUser(userId) {
  return fetchAPI(`admin/users/${userId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ status: "inactive" }),
  });
}

export async function deleteUser(userId) {
  return fetchAPI(`admin/users/${userId}`, { method: "DELETE" });
}

export async function reportUser(userId, reason) {
  return fetchAPI(`admin/users/${userId}/report`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// -------------------------------
// Export everything as default
// -------------------------------
export default {
  fetchAPI,
  postAPI,
  getUser,
  updateUser,
  getListings,
  createListing,
  getAllUsers,
  approveUser,
  rejectUser,
  deleteUser,
  reportUser,
};
