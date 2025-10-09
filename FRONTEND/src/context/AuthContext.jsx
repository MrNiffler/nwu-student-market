import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  // Sign in function (backend)
  const signIn = async (email, password) => {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Call backend login endpoint
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    setCurrentUser(data.user || { email }); // fallback minimal user
    localStorage.setItem("user", JSON.stringify(data.user || { email }));

    return data.user;
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

    if (!res.ok) throw new Error("Sign up failed");

    const data = await res.json();
    setCurrentUser(data.user || { email }); // fallback minimal user
    localStorage.setItem("user", JSON.stringify(data.user || { email }));

    return data.user;
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  // Optional: Dummy login for testing (comment out if needed)
  const loginDummy = () => {
    const dummyUser = { id: 1, name: "Dummy User", email: "dummy@student.nwu.ac.za", role: "user" };
    setCurrentUser(dummyUser);
    localStorage.setItem("user", JSON.stringify(dummyUser));
  };

  const value = { currentUser, signIn, signUp, signOut, loginDummy };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
