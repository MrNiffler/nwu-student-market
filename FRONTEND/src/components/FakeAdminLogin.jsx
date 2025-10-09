// src/components/FakeAdminLogin.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function FakeAdminLogin() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Set a fake admin user in localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "AdminTest", role: "admin" })
    );
    // Navigate to the Admin Dashboard
    navigate("/admin");
  };

  return (
    <div className="p-4">
      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Login as Admin (Test)
      </button>
    </div>
  );
}

export default FakeAdminLogin;
