import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    if (isRegister && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    const endpoint = isRegister
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Required for cookies/sessions
        body: JSON.stringify(
          isRegister
            ? { name: formData.name, email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password }
        ),
      });
  
      const data = await response.json();
      if (response.ok) {
        if (!isRegister) {
          // Store user info in local storage
          localStorage.setItem("user", JSON.stringify(data.user)); // Assuming backend sends { user: { name, email } }
        }
        alert(isRegister ? "Registration successful!" : "Login successful!");
        navigate("/dashboard");
      } else {
        setError(data.msg || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to connect to the server. Please try again later.");
    }
  };
  
  return (
    <div className="auth-div lg:w-full flex h-screen items-center justify-center bg-gray-100">
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
    </div>
  );
};

export default AuthPage;
