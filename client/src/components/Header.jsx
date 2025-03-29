import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import Logo from "../assets/Clogo.png"; // Adjust the path based on your project structure

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="bg-background text-octonary p-4 flex justify-between items-center shadow-lg bg-blurred-dark">
      {/* Logo Section */}
      <div className="flex items-center">
        <img
          src={Logo}
          alt="CODEUP Logo"
          className="h-12 w-auto object-contain" // Use w-auto to maintain aspect ratio
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Navigation and User Section */}
      {user && (
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <nav className="flex space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-senary hover:text-teal transition-colors duration-200 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/workspaces")}
              className="text-senary hover:text-teal transition-colors duration-200 font-medium"
            >
              Workspaces
            </button>
          </nav>

          {/* User Info and Logout */}
          <span className="text-senary font-medium">{user.displayName}</span>
          <button
            onClick={logout}
            className="bg-quaternary px-4 py-2 rounded-lg hover:bg-tertiary text-octonary transition-colors duration-200 font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;