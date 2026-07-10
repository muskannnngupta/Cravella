import mongoose from "mongoose";

const promoSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    expirationDate: { type: Date }
}, { timestamps: true });

const promoModel = mongoose.models.promo || mongoose.model("promo", promoSchema);

export default promoModel;
