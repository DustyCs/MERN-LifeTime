import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import Footer from "../components/Footer";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    if (isRegister && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }
  
    const endpoint = isRegister
      ? `${import.meta.env.VITE_API_BASE_URL}/auth/register`
      : `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          isRegister
            ? { name: formData.name, email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password }
        ),
      });
  
      const data = await response.json();
      if (response.ok) {
        if (isRegister) {
          // If registration is successful, automatically log in
          const loginResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email: formData.email, password: formData.password }),
          });
  
          const loginData = await loginResponse.json();
          if (loginResponse.ok) {
            localStorage.setItem("user", JSON.stringify(loginData.user));
            localStorage.setItem("token", loginData.token);
            setUser(loginData.user); // Update user state
            toast.success("Registration successful! Logged in automatically.");
          } else {
            toast.error(loginData.msg || "Login failed after registration. Please log in manually.");
          }
        } else {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          setUser(data.user); // Update user state
          toast.success("Login successful!");
        }
        navigate("/");
      } else {
        setError(data.msg || "Something went wrong. Please try again.");
        toast.error(data.msg || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to connect to the server. Please try again later.");
      toast.error("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="auth-div flex-col lg:w-full flex h-screen items-center justify-center bg-gray-100">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-md 
                        lg:w-[40rem] lg:h-[30rem] flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-500">
          {isRegister ? "Register" : "Login"}
        </h2>
        
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          {isRegister && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          )}
          <button type="submit" className="w-full bg-red-500 text-white py-2 rounded cursor-pointer">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center mt-4">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsRegister(!isRegister)} className="text-blue-500 underline cursor-pointer">
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
      <Footer />
    </div>
    
  );
};

export default AuthPage;