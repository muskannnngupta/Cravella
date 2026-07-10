import express from "express";
import { createTicket, getUserTickets, getAllTickets, replyToTicket } from "../Controllers/supportController.js";
import authMiddleware from "../Middleware/auth.js";

const supportRouter = express.Router();

// User endpoints
supportRouter.post("/create", authMiddleware, createTicket);
supportRouter.get("/user", authMiddleware, getUserTickets);

// Admin endpoints (No auth middleware used for admin in current backend architecture)
supportRouter.get("/list", getAllTickets);
supportRouter.post("/reply", replyToTicket);

export default supportRouter;
