import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Export a custom hook for easier usage
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Example: Load user from localStorage on mount
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setCurrentUser(savedUser);
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    // TODO: Replace this with real authentication (Firebase, backend, etc.)
    // For now, we just accept any email/password
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = { email }; // minimal user object
    setCurrentUser(user);

    // Save to localStorage so page refresh keeps the user logged in
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  };

  // Sign out function
  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  // The context value
  const value = {
    currentUser,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
