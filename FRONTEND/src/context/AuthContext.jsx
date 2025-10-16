import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, setAuthToken } from "../api/endpoints.js";
import axios from "axios";

// ✅ Export AuthContext so it can be imported by name
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Helper to save user and token
const setLocalUser = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
  setAuthToken(token);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        if (savedUser && token) {
          setAuthToken(token);
          const res = await axios.get("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUser(res.data);
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoadingUser(false);
      }
    };
    loadUser();
  }, []);

  // ---------- Login ----------
  const signIn = async (email, password) => {
    if (!email || !password) throw new Error("Email and password are required");

    try {
      const res = await loginUser({ email, password });
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
      console.error("Login error:", err);
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  // ---------- Signup ----------
const signUp = async (full_name, email, password, student_number, role = "buyer") => {
  if (!full_name || !email || !password || !student_number)
    throw new Error("All fields are required");

  try {
    const res = await registerUser({ full_name, email, password, student_number, role });
    const { token, user: createdUser } = res.data;

    // If token exists, use it
    if (token) {
      setAuthToken(token);
      const userRes = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = userRes.data;
      setCurrentUser(user);
      setLocalUser(user, token);
      return user;
    }

    // If no token returned but user was created, still proceed
    if (createdUser) {
      setCurrentUser(createdUser);
      localStorage.setItem("user", JSON.stringify(createdUser));
      console.warn("Signup successful but no token returned");
      return createdUser;
    }

    throw new Error("No token or user returned from signup");
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
    setAuthToken(null);
  };

  const value = {
    currentUser,
    signIn,
    signUp,
    updateUser,
    signOut,
    sendPasswordReset,
    loadingUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
