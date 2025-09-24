import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditCoupon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "percent",
    discountValue: "",
    expiryDate: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch coupon details
    const fetchCoupon = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/coupons/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoupon();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/coupons/${id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Coupon updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Error updating coupon");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Coupon</h2>

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
          value={form.expiryDate?.split("T")[0] || ""}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-3"
        >
          Update Coupon
        </button>

        {message && (
          <p className="text-center text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
