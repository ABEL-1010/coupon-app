// controllers/couponController.js
import QRCode from "qrcode";
import { nanoid } from "nanoid";
import Coupon from "../models/Coupon.js";

// Create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const { title, description, discountType, discountValue, expiryDate } = req.body;

    // Generate unique code and QR
    const code = nanoid(8);
    const couponUrl = `${process.env.BASE_URL}/coupon/${code}`;
    const qr = await QRCode.toDataURL(couponUrl);

    // Save coupon to DB
    const coupon = await Coupon.create({
      owner: req.user._id, // from auth middleware
      title,
      description,
      discountType,
      discountValue,
      expiryDate,
      code,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      qr,
    });

    res.status(201).json(coupon);
  } catch (err) {
    console.error("Error creating coupon:", err.message);
    res.status(500).json({ message: "Error creating coupon", error: err.message });
  }
};

// Get all coupons for the logged-in owner
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    console.error("Error fetching coupons:", err.message);
    res.status(500).json({ message: "Error fetching coupons" });
  }
};

// Public: get a coupon by its code
export const getCouponByCode = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    res.json(coupon);
  } catch (err) {
    console.error("Error fetching coupon by code:", err.message);
    res.status(500).json({ message: "Error fetching coupon", error: err.message });
  }
};
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id, // only owner can delete
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    console.error("Error deleting coupon:", err.message);
    res.status(500).json({ message: "Error deleting coupon" });
  }
};
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};