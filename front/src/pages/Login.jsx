import { useState } from "react";
import { loginUser } from "../api/authAPI.js";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import companyLogo from "../assets/logg.png";
import loginImage from "../assets/loginPicture.jpg";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      localStorage.setItem("user", JSON.stringify({ name: res.data.name }));
      setMessage(`Welcome back, ${res.data.name}!`);
      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black-700 to-stone-700 relative overflow-hidden">
  {/* Diagonal Lines */}
  <div className="absolute top-0 left-0 w-full h-1 bg-stone-300/20 transform -rotate-45 origin-left"></div>
  <div className="absolute top-20 left-0 w-full h-0.5 bg-stone-400/15 transform -rotate-30 origin-left"></div>
  <div className="absolute bottom-10 right-0 w-full h-1 bg-stone-500/25 transform rotate-60 origin-right"></div>
  
  {/* Rectangles */}
  <div className="absolute top-1/4 right-16 w-32 h-32 border-2 border-green-500 transform rotate-45"></div>
  <div className="absolute bottom-1/3 left-20 w-24 h-24 border border-orange-700 transform -rotate-12"></div>

  <div className="flex shadow-lg rounded-lg overflow-hidden">
    {/* Left side image */}
    <div
      className="w-96 hidden sm:block"
      style={{
        backgroundImage: `url(${loginImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>

    {/* Right side form */}
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 w-96 flex flex-col justify-center"
    >
      <div className="flex pb-2">
        <img
          src={companyLogo}
          alt="Company Logo"
          className="h-12 w-12 object-contain"
        />
      </div>
      <h2 className="text-2xl font-bold mb-4 ">Welcome back</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 mb-3 border rounded"
        required
      />

      <div className="relative mb-3">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 pr-10 border rounded"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Login
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}

      <p className="mt-4 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/register" className="text-green-600 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  </div>
</div>

  );
}
