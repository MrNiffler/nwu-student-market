import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const setLocalUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data);
      setLocalUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Fetch current user error:", err);
      return null;
    }
  };

  // ---------- Sign in ----------
const signIn = async (email, password) => {
  if (!email || !password) throw new Error("Email and password are required");

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    const user = { ...res.data.user, token: res.data.token }; // ✅ add token
    setCurrentUser(user);
    setLocalUser(user);

    return user;
  } catch (err) {
    console.error("Login error:", err);
    throw new Error(err.response?.data?.message || err.message || "Login failed");
  }
};

// ---------- Signup ----------
const signUp = async (full_name, email, password, student_number, role = "buyer") => {
  if (!full_name || !email || !password || !student_number)
    throw new Error("All fields are required");

  try {
    const res = await axios.post("http://localhost:5000/api/auth/register", {
      full_name,
      email,
      password,
      student_number,
      role,
    });

    const user = { ...res.data.user, token: res.data.token || "" }; // ✅ add token if exists
    setCurrentUser(user);
    setLocalUser(user);
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

  // ---------- Logout ----------
  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // ---------- Password reset ----------
  const sendPasswordReset = async (email) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", { email });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Password reset failed");
    }
  };

  const value = {
    currentUser,
    signIn,
    signUp,
    updateUser,
    signOut,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
