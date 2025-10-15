import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, setAuthToken } from "../api/endpoints.js"; 
import axios from "axios"; // needed for password reset request

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const setLocalUser = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
  setAuthToken(token);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setCurrentUser(savedUser);
      setAuthToken(token);
    }
  }, []);

  // ---------- Backend login ----------
  const signIn = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      const res = await loginUser({ email, password });
      const { token, user } = res.data;
      setCurrentUser(user);
      setLocalUser(user, token);
      return user;
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(
        err.response?.data?.message || "Login failed. Check credentials."
      );
    }
  };

  // ---------- Backend signup ----------
  const signUp = async (full_name, email, password, student_number, role = "buyer") => {
    if (!full_name || !email || !password || !student_number) {
      throw new Error("All fields are required");
    }

    try {
      const res = await registerUser({ full_name, email, password, student_number, role });
      const { token, user } = res.data;
      setCurrentUser(user);
      setLocalUser(user, token);
      return user;
    } catch (err) {
      console.error("Signup error:", err);
      throw new Error(
        err.response?.data?.message || "Sign up failed. Try again."
      );
    }
  };

  // ---------- Password Reset ----------
  const sendPasswordReset = async (email) => {
    if (!email) throw new Error("Email is required");
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      // assumes your backend accepts { email } and sends reset link
    } catch (err) {
      console.error("Password reset error:", err);
      throw new Error(err.response?.data?.message || "Failed to send reset link");
    }
  };

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
    signOut,
    sendPasswordReset, // <--- added here
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
