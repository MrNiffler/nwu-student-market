// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is imported

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Dummy credentials (for frontend-only testing)
const DUMMY_PASSWORD = "password123";
const DUMMY_USERS = {
  "admin@mynwu.ac.za": {
    id: 1001,
    full_name: "Admin Tester",
    email: "admin@mynwu.ac.za",
    role: "admin",
  },
  "buyer@mynwu.ac.za": {
    id: 1002,
    full_name: "Buyer Tester",
    email: "buyer@mynwu.ac.za",
    role: "buyer",
  },
  "seller@mynwu.ac.za": {
    id: 1003,
    full_name: "Seller Tester",
    email: "seller@mynwu.ac.za",
    role: "seller",
  },
};

//  Helper to persist user locally
const setLocalUser = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Load saved user on mount
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  // Fixed Sign In function
  const signIn = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const lowerEmail = String(email).trim().toLowerCase();
    const dummy = DUMMY_USERS[lowerEmail];

    // 
    if (dummy && password === DUMMY_PASSWORD) {
      const token = `${dummy.role}-dummy-token`;
      setCurrentUser(dummy);
      setLocalUser(dummy, token);
      return dummy; // Return the dummy user
    }

    // Optional backend logic (disabled for now)
    /*
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Login failed");
    const user = data.user || { email };
    setCurrentUser(user);
    setLocalUser(user, data.token || "backend-token");
    return user;
    */

    throw new Error("Invalid email or password. Please try again.");
  };

  //  Sign Up (backend only)
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

      const { token, user } = res.data;
      if (!token || !user) throw new Error("Invalid signup response");

      setCurrentUser(user);
      setLocalUser(user, token);
      return user;
    } catch (err) {
      console.error("Signup error:", err);
      throw new Error(err.response?.data?.message || "Sign up failed");
    }
  };

  // Update user profile
  const updateUser = async (updates) => {
    if (!currentUser) throw new Error("No logged-in user");

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null) data.append(key, value);
      });

      const res = await axios.patch("http://localhost:5000/api/users/me", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data;
      setCurrentUser(updatedUser);
      setLocalUser(updatedUser, token);
      return updatedUser;
    } catch (err) {
      console.error("Update user error:", err);
      throw new Error(err.response?.data?.message || "Failed to update profile");
    }
  };

  //Logout
  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Quick dummy login helper
  const loginDummy = (role) => {
    const entry = Object.values(DUMMY_USERS).find((u) => u.role === role);
    if (!entry) throw new Error("Invalid dummy role");
    const token = `${entry.role}-dummy-token`;
    setCurrentUser(entry);
    setLocalUser(entry, token);
    return entry;
  };

 //DONT REMOVE FORGET PASSWORD WONT WORK!!! Send Password Reset (dummy / frontend simulation)
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

  // Provide everything in context
  const value = {
    currentUser,
    signIn,
    signUp,
    updateUser,
    signOut,
    loginDummy,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
