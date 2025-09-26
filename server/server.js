// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utils/db.js";

import authRoutes from "./routes/auth.js";
import couponRoutes from "./routes/coupon.js";



dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/coupons", couponRoutes);

app.get("/", (req, res) => {
  res.send("Server is running ");
});

// DB + Server start
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    const url = isProduction ? `port ${PORT}` : `http://localhost:${PORT}`;
    console.log(`Server running on ${url}`);
  });
});
