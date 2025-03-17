import React from "react";
import "../css/styles.css";
import { Links } from "../data/links";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/access");
  };

  return (
    <nav className="w-70 bg-[#f54257] text-white min-h-screen p-4">
      <div className="text-5xl font-bold mb-4">LifeTime</div>
      <div className="flex flex-col space-y-2 sticky top-0">
        {Links.map((link) => {
          if (link.showIfLoggedIn && !user) return null; // Hide if user is NOT logged in
          if (link.showIfLoggedOut && user) return null; // Hide if user IS logged in

          return link.name === "Logout" ? (
            <button
              key="logout"
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-[#f54257] rounded text-2xl hover:bg-gray-200 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <a
              key={link.name}
              href={link.path}
              className="px-4 py-2 rounded text-2xl hover:text-black hover:bg-[#f1f1f1] transition duration-300"
            >
              {link.name}
            </a>
          );
        })}
      </div>
    </nav>
  );
}