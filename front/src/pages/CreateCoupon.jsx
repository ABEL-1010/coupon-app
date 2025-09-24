import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import companyLogo from "../assets/logg.png";

import {
  PlusCircleIcon,
  ChartBarIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

export default function CreateCoupon() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.name) {
        setUserName(storedUser.name);
      }
    }, [])

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "percent",
    discountValue: "",
    expiryDate: "",
  });
  const [image, setImage] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [message, setMessage] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("discountType", form.discountType);
      formData.append("discountValue", form.discountValue);
      formData.append("expiryDate", form.expiryDate);
      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://localhost:5000/api/coupons",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setQrPreview(res.data.qr); // show live QR preview
      setMessage("Coupon created successfully!");
      // Redirect back to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard", { state: { newCoupon: res.data } });
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error creating coupon");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md fixed top-0 bottom-0 flex flex-col justify-between">
        <div>
          {/* Profile */}
          <div className="p-6 border-b flex flex-col items-center">
                      <img
                        src={companyLogo}
                        alt="Company Logo"
                        className="h-16 w-16 object-contain mb-4"
                      />
                      <h2 className="text-xl font-bold">{userName}</h2>
                      <p className="text-sm text-gray-500">My Dashboard</p>
            </div>

          {/* Navigation */}
          <nav className="mt-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <TicketIcon className="h-5 w-5 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => navigate("/create-coupon")}
              className="flex items-center w-full px-6 py-3 text-gray-700 bg-gray-100"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Create Coupon
            </button>
            <button
              onClick={() => navigate("/analytics")}
              className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100"
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Analytics
            </button>
            {/* Logout */}
             <div className="p-6 ">
                 <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                 >
                 Logout
                </button>
            </div>
                </nav>
            </div>

        
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-64 mt-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Create Coupon</h2>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
          />

          <div className="flex gap-2 mb-3">
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
            >
              <option value="percent">Percent</option>
              <option value="fixed">Fixed Amount</option>
            </select>

            <input
              type="number"
              name="discountValue"
              placeholder="Discount Value"
              value={form.discountValue}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
              required
            />
          </div>

          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-3"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-3"
          >
            Create Coupon
          </button>

          {message && (
            <p className="text-center text-gray-700 mb-3">{message}</p>
          )}

          {/* Live QR Code Preview */}
          {qrPreview && (
            <div className="text-center">
              <h3 className="font-semibold mb-2">QR Code:</h3>
              <img
                src={qrPreview}
                alt="QR Code"
                className="mx-auto w-40 h-40"
              />
            </div>
          )}
        </form>
        
      </main>
    </div>
  );
}
