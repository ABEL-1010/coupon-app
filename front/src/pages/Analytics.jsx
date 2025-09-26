import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import companyLogo from "../assets/logg.png";
import {
  ChartBarIcon,
  TicketIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

// ✅ Import Recharts components
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userName, setUserName] = useState("User");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setUserName(storedUser.name);
    }
  }, []);

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("https://coupon-app-server.onrender.com/api/coupons", {
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

  // --- Analytics calculations ---
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(
    (c) => c.expiryDate && new Date(c.expiryDate) > new Date()
  ).length;
  const expiredCoupons = totalCoupons - activeCoupons;

  // Fake redemption numbers (replace with backend stats later)
  const usageData = coupons.map((c) => ({
    name: c.title,
    redemptions: c.redemptions || Math.floor(Math.random() * 50),
  }));

  // Discount type breakdown
  const discountTypes = [
    {
      name: "Percentage",
      value: coupons.filter((c) => c.discountType === "percent").length,
    },
    {
      name: "Fixed Amount",
      value: coupons.filter((c) => c.discountType === "fixed").length,
    },
  ];

  const COLORS = ["#3b82f6", "#f97316"];

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
            <p className="text-sm text-gray-500">Analytics</p>
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
              className="flex items-center w-full px-6 py-3 text-gray-700 bg-gray-200"
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
      <main className="flex-1 p-8 ml-64 pb-16">
        <h1 className="text-3xl font-bold mb-6">Coupon Analytics</h1>

        {loading ? (
          <p>Loading analytics...</p>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-lg ">Total Coupons</h3>
                <p className="text-2xl text-blue-600">{totalCoupons}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-lg">Active Coupons</h3>
                <p className="text-2xl text-green-600">{activeCoupons}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-lg">Expired Coupons</h3>
                <p className="text-2xl text-red-600">{expiredCoupons}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4">Coupon Redemptions</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="redemptions" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-4">Discount Type Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={discountTypes}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {discountTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
