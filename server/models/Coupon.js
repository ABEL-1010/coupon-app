// models/Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  discountType: { type: String, enum: ['percent','fixed'], default: 'percent' },
  discountValue: { type: Number, required: true },
  code: { type: String, required: true, unique: true },
  imageUrl: String,
  qr: String, // data URL or link to file
  expiryDate: Date,
  createdAt: { type: Date, default: Date.now },
  redeemed: { type: Boolean, default: false } // optional
});

// Export as ES6 default
const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
