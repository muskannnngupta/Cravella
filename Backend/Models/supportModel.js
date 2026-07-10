import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    orderId: { type: String, default: "" },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Pending" }, // Pending, Replied, Resolved
    reply: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

const supportModel = mongoose.models.support || mongoose.model("support", supportSchema);
export default supportModel;
