import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateCoupon from "./pages/CreateCoupon.jsx";
import EditCoupon from "./pages/EditCoupon.jsx";
import Analytics from "./pages/Analytics.jsx";
import ProtectedRoute from "./components/ProtectedRoute .jsx"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
         <Route
          path="/create-coupon"
          element={
            <ProtectedRoute>
              <CreateCoupon />
            </ProtectedRoute>
          }
        />
        <Route path="/edit-coupon/:id" element={<EditCoupon />} />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
