import { useState } from "react";
import { registerUser } from "../api/authAPI.js"; // adjust import if needed
import { Link, useNavigate } from "react-router-dom";
import companyLogo from "../assets/logg.png";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      setMessage("Account created! Redirecting...");
      localStorage.setItem("token", res.data.token);
      setTimeout(() => navigate("/"), 1500); // redirect after signup
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating account");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black-700 to-stone-700">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-96"
      >
        <div className="flex pb-2">
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold mb-4 ">Welcome, create account</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
