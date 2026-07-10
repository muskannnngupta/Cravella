import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import { food_list } from "./assets/assets.js";
import dotenv from "dotenv";

dotenv.config();

const addData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Delete old data (optional)
    await foodModel.deleteMany({});

    const data = food_list.map((item) => ({
      name: item.name,
      description: item.description,
      price: item.price,
      image: `${item.image}.png`,
      category: item.category,
    }));

    await foodModel.insertMany(data);

    console.log("✅ Food data inserted successfully!");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

addData();