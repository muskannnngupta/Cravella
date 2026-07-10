import promoModel from "../Models/promoModel.js";

// Add a new promo code
const addPromo = async (req, res) => {
    try {
        const { code, discountPercentage, expirationDate } = req.body;
        
        const existing = await promoModel.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.json({ success: false, message: "Promo code already exists" });
        }

        const promo = new promoModel({
            code: code.toUpperCase(),
            discountPercentage,
            expirationDate
        });
        await promo.save();
        res.json({ success: true, message: "Promo code added successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error adding promo code" });
    }
};

// List all promo codes (Admin)
const listPromos = async (req, res) => {
    try {
        const promos = await promoModel.find({});
        res.json({ success: true, data: promos });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error listing promo codes" });
    }
};

// Toggle active status
const togglePromo = async (req, res) => {
    try {
        const { id } = req.body;
        const promo = await promoModel.findById(id);
        if (!promo) return res.json({ success: false, message: "Promo not found" });

        promo.isActive = !promo.isActive;
        await promo.save();
        res.json({ success: true, message: "Promo status updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating promo" });
    }
};

// Validate a promo code (Frontend)
const validatePromo = async (req, res) => {
    try {
        const { code } = req.body;
        const promo = await promoModel.findOne({ code: code.toUpperCase() });
        
        if (!promo) {
            return res.json({ success: false, message: "Invalid promo code" });
        }
        if (!promo.isActive) {
            return res.json({ success: false, message: "Promo code is inactive" });
        }
        if (promo.expirationDate && new Date(promo.expirationDate) < new Date()) {
            return res.json({ success: false, message: "Promo code has expired" });
        }

        res.json({ success: true, discountPercentage: promo.discountPercentage });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error validating promo code" });
    }
};

export { addPromo, listPromos, togglePromo, validatePromo };
