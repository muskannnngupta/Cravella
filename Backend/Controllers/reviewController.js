import reviewModel from "../Models/reviewModel.js";
import userModel from "../Models/userModel.js";

// Add a review
const addReview = async (req, res) => {
    try {
        const { foodId, rating, comment } = req.body;
        const userId = req.user.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const review = new reviewModel({
            userId,
            userName: user.name,
            foodId,
            rating,
            comment
        });

        await review.save();
        res.json({ success: true, message: "Review added successfully", data: review });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error adding review" });
    }
};

// Get reviews for a specific food item
const getFoodReviews = async (req, res) => {
    try {
        const { foodId } = req.body;
        const reviews = await reviewModel.find({ foodId }).sort({ createdAt: -1 });
        
        let avgRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
            avgRating = (sum / reviews.length).toFixed(1);
        }

        res.json({ success: true, data: { reviews, avgRating, totalReviews: reviews.length } });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching reviews" });
    }
};

export { addReview, getFoodReviews };
