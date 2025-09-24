import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import companyLogo from "../assets/logg.png";
import Footer from "../components/Footer.jsx";

import {
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  PlusCircleIcon,
  ChartBarIcon,
  TicketIcon,
  XMarkIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null); // for modal
  const [visibleCount, setVisibleCount] = useState(7); // show first 7 by default

  const token = localStorage.getItem("token");
  const [userName, setUserName] = useState("User");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    }
  }, []);


  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigate("/");
    else fetchCoupons();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(coupons.filter((c) => c._id !== id)); // update UI
    } catch (err) {
      console.error(err);
      alert("Error deleting coupon");
    }
  };

  const handleShare = (coupon) => {
    setSelectedCoupon(coupon);
  };

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    alert("Coupon link copied!");
  };
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white fixed top-0 bottom-0 shadow-md flex flex-col justify-between">
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
              className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100"
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
            <div className="p-6">
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
      <main className="flex-1 p-8 ml-64 pb-16 ">
      <div className="flex items-center justify-between mb-6">
    <h1 className="text-3xl font-bold">My Coupons</h1>
    <input
      type="text"
      placeholder="Search coupons..."
      className="w-64 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
        {loading ? (
          <p>Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p>No coupons created yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons
          .filter((coupon) =>
            coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, visibleCount).map((coupon) => (
                  <div
                  key={coupon._id}
                  className="bg-white rounded-lg shadow p-3 flex flex-col justify-between h-56"
                  >
                  <div>
                    <h2 className="text-lg font-bold mb-1">{coupon.title}</h2>
                    <p className="text-gray-700 text-sm mb-1 truncate">
                      {coupon.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {coupon.discountType === "percent"
                        ? `${coupon.discountValue}% off`
                        : `$${coupon.discountValue} off`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Expires:{" "}
                      {coupon.expiryDate
                        ? new Date(coupon.expiryDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  {coupon.qr && (
                    <img
                      src={coupon.qr}
                      alt="QR code"
                      className="mt-2 w-16 h-16 self-center"
                    />
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex justify-between items-center">
                    {/* Edit */}
                    <button
                      onClick={() => navigate(`/edit-coupon/${coupon._id}`)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleShare(coupon)}
                      className="flex items-center px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                    >
                      <ShareIcon className="h-4 w-4 mr-1" />
                      Share
                    </button>
                  </div>
                 </div>
              ))}
            </div>

            {/* Show More / Show Less */}
            {coupons.length > 6 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() =>
                    setVisibleCount(
                      visibleCount === 6 ? coupons.length : 6
                    )
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {visibleCount === 6 ? "Show More" : "Show Less"}
                </button>
              </div>
            )}
          </>
        )}
        <Footer />
      </main>
      

      {/* Share Modal */}
      {selectedCoupon && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            {/* Close */}
            <button
              onClick={() => setSelectedCoupon(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-bold mb-4">Share Coupon</h2>

            <div className="text-center">
              <h3 className="font-semibold mb-2">{selectedCoupon.title}</h3>
              {selectedCoupon.qr && (
                <img
                  src={selectedCoupon.qr}
                  alt="QR code"
                  className="mx-auto w-32 h-32 mb-4"
                />
              )}
              <p className="text-gray-600 text-sm mb-4">
                Share this coupon with your customers:
              </p>

              {/* Link + Copy */}
              <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-4">
                <span className="text-sm text-gray-700 truncate">
                  {`${window.location.origin}/redeem/${selectedCoupon._id}`}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${window.location.origin}/redeem/${selectedCoupon._id}`
                    )
                  }
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <ClipboardIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${window.location.origin}/redeem/${selectedCoupon._id}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                >
                  WhatsApp
                </a>
                <a
                  href={`mailto:?subject=Check out this coupon&body=${encodeURIComponent(
                    `${window.location.origin}/redeem/${selectedCoupon._id}`
                  )}`}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                  Email
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `${window.location.origin}/redeem/${selectedCoupon._id}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 text-xs"
                >
                  Facebook
                </a>
                <a
                 href={`https://t.me/share/url?url=${encodeURIComponent(
                 `${window.location.origin}/redeem/${selectedCoupon._id}`
                 )}&text=${encodeURIComponent(selectedCoupon.title)}`}
                 target="_blank"
                 rel="noreferrer"
                 className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                 Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
      
      </div>
    </div>
  );
  
}
