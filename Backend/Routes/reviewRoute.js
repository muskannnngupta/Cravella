import express from "express";
import { addReview, getFoodReviews } from "../Controllers/reviewController.js";
import authMiddleware from "../Middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", authMiddleware, addReview);
reviewRouter.post("/food", getFoodReviews); // Fetch reviews for a food item (anyone can fetch, post requires foodId)

export default reviewRouter;
