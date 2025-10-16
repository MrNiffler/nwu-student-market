// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// ✅ Export AuthContext so it can be imported by name
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Dummy accounts (frontend-only)
const DUMMY_PASSWORD = "password123";
const DUMMY_USERS = {
  "admin@mynwu.ac.za": {
    id: 1001,
    full_name: "Admin Tester",
    email: "admin@mynwu.ac.za",
    role: "admin",
  },
  "buyer@mynwu.ac.za": {
    id: 22,
    full_name: "Buyer Tester",
    email: "buyermy@nwu.ac.za",
    role: "buyer",
  },
  "seller@mynwu.ac.za": {
    id: 1003,
    full_name: "Seller Tester",
    email: "seller@nwu.ac.za",
    role: "seller",
  },
};

// Helper: set user + token locally
const setLocalUser = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  // Sign in function (backend), but with dummy-account shortcut
  const signIn = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const lowerEmail = String(email).trim().toLowerCase();
    const dummy = DUMMY_USERS[lowerEmail];
    if (dummy && password === DUMMY_PASSWORD) {
      const token = `${dummy.role}-dummy-token`;
      setCurrentUser(dummy);
      setLocalUser(dummy, token);
      return dummy;
    }

    // Backend call (disabled)
    /*
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Login failed");
    if (data.token) localStorage.setItem("token", data.token);
    setCurrentUser(data.user || { email });
    localStorage.setItem("user", JSON.stringify(data.user || { email }));
    return data.user;
    */
  };

  // ---------- Signup ----------
  const signUp = async (full_name, email, password, student_number, role = "buyer") => {
    if (!full_name || !email || !password || !student_number)
      throw new Error("All fields are required");

    try {
      const res = await registerUser({ full_name, email, password, student_number, role });
      const { token } = res.data;
      if (!token) throw new Error("No token returned");

      setAuthToken(token);
      const userRes = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = userRes.data;
      setCurrentUser(user);
      setLocalUser(user, token);
      return user;
    } catch (err) {
      console.error("Signup error:", err);
      throw new Error(err.response?.data?.message || "Sign up failed");
    }
  };

  // ---------- Update User ----------
  const updateUser = async (updates) => {
    if (!currentUser) throw new Error("No logged-in user");

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      // Append updates (supports file uploads, e.g., avatar)
      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined && updates[key] !== null) {
          data.append(key, updates[key]);
        }
      });

      const res = await axios.patch(
        "http://localhost:5000/api/users/me",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = res.data;
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (err) {
      console.error("Update user error:", err);
      throw new Error(err.response?.data?.message || "Failed to update profile");
    }
  };

  // ---------- Password Reset ----------
  const sendPasswordReset = async (email) => {
    if (!email) throw new Error("Email is required");
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
    } catch (err) {
      console.error("Password reset error:", err);
      throw new Error(err.response?.data?.message || "Failed to send reset link");
    }
  };

  // ---------- Logout ----------
  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Explicit dummy login (admin/buyer/seller)
  const loginDummy = (role) => {
    const entry = Object.values(DUMMY_USERS).find((u) => u.role === role);
    if (!entry) return null;
    const token = `${entry.role}-dummy-token`;
    setCurrentUser(entry);
    setLocalUser(entry, token);
    return entry;
  };

  // DONT REMOVE FORGET PASSWORD WONT WORK!!! Send Password Reset (dummy / frontend simulation)
  const sendPasswordReset = async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email.endsWith("@mynwu.ac.za")) {
          reject(new Error("Invalid NWU email address"));
        } else if (!Object.keys(DUMMY_USERS).includes(email.toLowerCase())) {
          reject(new Error("No account found for that email"));
        } else {
          console.log(`Simulated reset email sent to ${email}`);
          resolve(true);
        }
      }, 1000);
    });
  };

  // ✅ Include sendPasswordReset in context value
  const value = {
    currentUser,
    signIn,
    signUp,
    updateUser,        // new
    signOut,
    loginDummy,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

