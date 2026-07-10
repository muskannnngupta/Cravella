import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://muskangupta5465:muskangupta2006@cluster0.axhpwvg.mongodb.net/Food-delivery-website');
        console.log("db connected");
    } catch (error) {
        console.error("DB connection failed:", error);
        process.exit(1);
    }
}