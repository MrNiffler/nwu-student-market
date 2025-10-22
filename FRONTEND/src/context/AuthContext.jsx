import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const setLocalUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  if (user?.token) localStorage.setItem("token", user.token); // store token separately
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ---------- Fetch current user ----------
  const fetchCurrentUser = async () => {
    setLoadingUser(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCurrentUser(null);
        setLoadingUser(false);
        return null;
      }

      // Updated dummy user to include full_name & student_number
      const dummyUser = { 
        full_name: "Admin User", 
        student_number: "00012345", 
        email: "admin@example.com", 
        role: "admin", 
        token 
      };
      setCurrentUser(dummyUser);
      setLocalUser(dummyUser);
      setLoadingUser(false);
      return dummyUser;
    } catch (err) {
      console.error("Fetch current user error:", err);
      setCurrentUser(null);
      setLoadingUser(false);
      return null;
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // ---------- Sign in ----------
const signIn = async (email, password) => {
  if (!email || !password) throw new Error("Email and password are required");

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
    const token = res.data.token;
    if (!token) throw new Error("Login failed: no token returned");
    localStorage.setItem("token", token);

    const meRes = await axios.get("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = { ...meRes.data, token };
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));

    return user; // <- you can now read user.role in the frontend
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
      // Step 1: register
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        full_name,
        email,
        password,
        student_number,
        role,
      });

      const token = res.data.token;
      if (!token) throw new Error("Sign up failed: no token returned");

      // Step 2: include full_name & student_number
      const user = { 
        full_name, 
        student_number, 
        email, 
        role, 
        token 
      };
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

      const res = await axios.patch("http://localhost:5000/api/users/me", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = { 
        full_name: res.data.full_name || currentUser.full_name,
        student_number: res.data.student_number || currentUser.student_number,
        email: res.data.email || currentUser.email,
        role: res.data.role || currentUser.role,
        token
      };
      setCurrentUser(updatedUser);
      setLocalUser(updatedUser);
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
    loadingUser,
    signIn,
    signUp,
    updateUser,
    signOut,
    sendPasswordReset,
    fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
