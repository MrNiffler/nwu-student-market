const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Generic fetch wrapper
async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API request failed");
  }

  return res.json();
}

// ===== Listings =====
export async function getListings() {
  return fetchAPI("listings");
}

export async function getListingById(id) {
  return fetchAPI(`listings/${id}`);
}

export async function createListing(data) {
  return fetchAPI("listings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateListing(id, data) {
  return fetchAPI(`listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteListing(id) {
  return fetchAPI(`listings/${id}`, {
    method: "DELETE",
  });
}

// ===== Users (if needed) =====
export async function getUsers() {
  return fetchAPI("users");
}
