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
    image: null, // for new image upload
  });
  const [preview, setPreview] = useState(null); // old/new image preview
  const [message, setMessage] = useState("");

  // ✅ Fetch coupon details
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/coupons/by-id/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { title, description, discountType, discountValue, expiryDate, imageUrl } = res.data;

        setForm({
          title: title || "",
          description: description || "",
          discountType: discountType || "percent",
          discountValue: discountValue || "",
          expiryDate: expiryDate ? expiryDate.split("T")[0] : "",
          image: null,
        });

        if (imageUrl) {
          setPreview(`http://localhost:5000${imageUrl}`);
        }
      } catch (err) {
        console.error("Error fetching coupon:", err);
        setMessage("Failed to load coupon details.");
      }
    };
    fetchCoupon();
  }, [id, token]);

  // ✅ Handle field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file)); // preview new image
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("discountType", form.discountType);
      formData.append("discountValue", form.discountValue);
      formData.append("expiryDate", form.expiryDate);

      if (form.image) {
        formData.append("image", form.image); // only add if user picked new image
      }

      await axios.put(`http://localhost:5000/api/coupons/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Coupon updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      console.error("Error updating coupon:", err);
      setMessage("Error updating coupon");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex justify-center items-start p-6">
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
          value={form.expiryDate}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        {/* Image Upload */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Coupon Image</label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover mb-2 rounded border"
            />
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-3"
        >
          Update Coupon
        </button>

        {message && <p className="text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
