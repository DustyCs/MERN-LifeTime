import { useState } from "react";
import "../css/styles.css";
import { Links } from "../data/links";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useAdminContext } from "../Context/AdminContext";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin , setIsAdmin } = useAdminContext();
  

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/access");
  };

  return (
    <>
      {/* Sidebar (Desktop) */}
      <nav className="hidden sm:flex flex-col w-64 bg-[#f54257] text-white min-h-screen p-4 shadow-lg">
        <div className="text-5xl font-extrabold mb-4">LifeTime</div>
        <div className="flex flex-col space-y-2">
          {Links.map((link) => {
            if (link.showIfLoggedIn && !user) return null;
            if (link.showIfLoggedOut && user) return null;
            if (link.showIfAdmin && !isAdmin) return null;

            return link.name === "Logout" ? (
              <button
                key="logout"
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-[#f54257] font-extrabold rounded text-2xl hover:bg-gray-200 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <a
                key={link.name}
                href={link.path}
                className="px-4 py-2 rounded text-2xl font-bold hover:text-black hover:bg-[#f1f1f1] transition duration-300"
              >
                {link.name}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation (Smaller Screens) */}
      <nav className="flex sm:hidden fixed top-0 left-0 w-full bg-[#f54257] text-white py-3 px-4 shadow-lg">
        <div className="flex justify-between items-center w-full">
          <div className="text-3xl font-bold">LifeTime</div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-3xl">
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Dropdown) */}
      {menuOpen && (
        <div className="sm:hidden fixed top-12 left-0 w-full bg-[#f54257] text-white p-4 shadow-lg">
          <ul className="flex flex-col space-y-2">
            {Links.map((link) => {
              if (link.showIfLoggedIn && !user) return null;
              if (link.showIfLoggedOut && user) return null;

              return link.name === "Logout" ? (
                <button
                  key="logout"
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-[#f54257] rounded text-lg hover:bg-gray-200 transition duration-300"
                >
                  Logout
                </button>
              ) : (
                <a
                  key={link.name}
                  href={link.path}
                  className="px-4 py-2 rounded text-lg hover:text-black hover:bg-[#f1f1f1] transition duration-300"
                >
                  {link.name}
                </a>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
