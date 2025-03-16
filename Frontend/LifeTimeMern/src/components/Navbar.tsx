import React, { useEffect, useState } from "react";
import "../css/styles.css";
import { Links, NavLink } from "../data/links"; // Import type and links array
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if a user is logged in (replace with your actual auth logic)
    const storedUser = localStorage.getItem("user");
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/access");
  };

  // Create a new Links array dynamically with the correct type
  const dynamicLinks: NavLink[] = Links.map((link) =>
    link.name === "Register/Login"
      ? {
          ...link,
          name: user ? "Logout" : "Register/Login",
          onClick: user ? handleLogout : undefined, // Assign logout function if logged in
        }
      : link
  );

  return (
    <nav className="w-70 bg-[#f54257] text-white min-h-screen p-4">
      <div className="text-5xl font-bold mb-4">LifeTime</div>
      <div className="flex flex-col space-y-2">
        {dynamicLinks.map((link) => (
          <a
            key={link.name}
            href={link.path}
            className="px-4 py-2 rounded text-2xl hover:text-black hover:bg-[#f1f1f1] transition duration-300"
            onClick={link.onClick ? (e) => { e.preventDefault(); link.onClick!(); } : undefined} 
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
}

// export default function Navbar() {
//     return (
//       <nav className='w-70 bg-[#f54257] text-white min-h-screen p-4'>
//         <div className='text-5xl font-bold mb-4'>LifeTime</div>
//         <div className='flex flex-col space-y-2'>
//             {Links.map((link) => (
//                 <a key={link.name} href={link.path} className='px-4 py-2 rounded text-2xl
//                                                              hover:text-black hover:bg-[#f1f1f1] transition duration-300'>{link.name}</a>
//             ))}
//         </div>
//       </nav>
//     );
//   }
  