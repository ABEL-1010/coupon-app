// routes/coupons.js
import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import { createCoupon, getCoupons, getCouponByCode, deleteCoupon, updateCoupon } from "../controllers/couponController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/", auth, upload.single("image"), createCoupon);
router.get("/", auth, getCoupons);
router.get("/:code", getCouponByCode);
router.delete("/:id", authMiddleware, deleteCoupon);
router.put("/:id", updateCoupon);

export default router;
