// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Dummy accounts (frontend-only)
const DUMMY_PASSWORD = "password123";
const DUMMY_USERS = {
  "admin@nwu.ac.za": {
    id: 1001,
    full_name: "Admin Tester",
    email: "admin@nwu.ac.za",
    role: "admin",
  },
  "buyer@nwu.ac.za": {
    id: 22,
    full_name: "Buyer Tester",
    email: "buyer@nwu.ac.za",
    role: "buyer",
  },
  "seller@nwu.ac.za": {
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
    // quick validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // ---------- DUMMY ACCOUNT CHECK ----------
    const lowerEmail = String(email).trim().toLowerCase();
    const dummy = DUMMY_USERS[lowerEmail];
    if (dummy && password === DUMMY_PASSWORD) {
      const token = `${dummy.role}-dummy-token`; // local-only token
      setCurrentUser(dummy);
      setLocalUser(dummy, token);
      return dummy;
    }
    // -----------------------------------------

    // ---------- BACKEND CALL (temporarily disabled) ----------
    /*
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.token) localStorage.setItem("token", data.token);
    setCurrentUser(data.user || { email });
    localStorage.setItem("user", JSON.stringify(data.user || { email }));

    return data.user;
    */
  };

  // Sign up function (backend)
  const signUp = async (full_name, email, password, student_number) => {
    if (!full_name || !email || !password || !student_number) {
      throw new Error("All fields are required");
    }

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password, student_number }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Sign up failed");
    }

    const data = await res.json();
    setCurrentUser(data.user || { email });
    localStorage.setItem("user", JSON.stringify(data.user || { email }));

    return data.user;
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Explicit programmatic dummy login (callable from components)
  const loginDummy = (role) => {
    // role: 'admin' | 'buyer' | 'seller'
    const entry = Object.values(DUMMY_USERS).find((u) => u.role === role);
    if (!entry) return null;
    const token = `${entry.role}-dummy-token`;
    setCurrentUser(entry);
    setLocalUser(entry, token);
    return entry;
  };

  const value = { currentUser, signIn, signUp, signOut, loginDummy };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
