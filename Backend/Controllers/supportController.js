import supportModel from "../Models/supportModel.js";
import userModel from "../Models/userModel.js";

// Create a new support ticket (User)
const createTicket = async (req, res) => {
    try {
        const { orderId, subject, message } = req.body;
        const userId = req.user.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const newTicket = new supportModel({
            userId,
            userName: user.name,
            userEmail: user.email,
            orderId: orderId || "",
            subject,
            message
        });

        await newTicket.save();
        res.json({ success: true, message: "Support ticket created successfully", data: newTicket });
    } catch (error) {
        console.error("Error creating support ticket:", error);
        res.json({ success: false, message: "Failed to create support ticket" });
    }
};

// Get all support tickets for logged-in user
const getUserTickets = async (req, res) => {
    try {
        const userId = req.user.userId;
        const tickets = await supportModel.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: tickets });
    } catch (error) {
        console.error("Error fetching user tickets:", error);
        res.json({ success: false, message: "Failed to fetch support tickets" });
    }
};

// Get all support tickets (Admin)
const getAllTickets = async (req, res) => {
    try {
        const tickets = await supportModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: tickets });
    } catch (error) {
        console.error("Error fetching all tickets:", error);
        res.json({ success: false, message: "Failed to fetch all support tickets" });
    }
};

// Reply to a ticket and mark as replied (Admin)
const replyToTicket = async (req, res) => {
    try {
        const { ticketId, reply } = req.body;

        const ticket = await supportModel.findById(ticketId);
        if (!ticket) {
            return res.json({ success: false, message: "Ticket not found" });
        }

        ticket.reply = reply;
        ticket.status = "Replied";
        
        await ticket.save();
        res.json({ success: true, message: "Reply sent successfully", data: ticket });
    } catch (error) {
        console.error("Error replying to ticket:", error);
        res.json({ success: false, message: "Failed to reply to ticket" });
    }
};

export { createTicket, getUserTickets, getAllTickets, replyToTicket };
