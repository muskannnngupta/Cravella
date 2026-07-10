import foodModel from "../Models/foodModel.js";
import fs from "fs";
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try{
    await food.save();
    res.json({success : true, message : "foodAdded"})
  }catch(error){
     console.log(error);
     res.json({success : false , message : "error"})
  }
};

//all food list

const listfood = async (req, res) => {

  try{
    const foods = await foodModel.find({});
    res.json({success : true, data : foods})
  }catch(error){
    console.log(error);
    res.json({success : false , message : "error"})
  }

}

// remove food item 

const removefood = async (req, res) => {

  try{
    const food = await foodModel.findById(req.body.id);
    fs.unlinkSync(`Uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({success : true, message : "foodRemoved"})
  }catch(error){
    console.log(error);
    res.json({success : false , message : "error"})
  }

}

// rate a food item
const rateFood = async (req, res) => {
  const { foodId, rating } = req.body;
  if (!foodId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: "Invalid parameters" });
  }

  try {
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.json({ success: false, message: "Food item not found" });
    }

    food.ratings = food.ratings || [];
    food.ratings.push(Number(rating));

    const total = food.ratings.reduce((sum, r) => sum + r, 0);
    food.averageRating = Math.round((total / food.ratings.length) * 10) / 10;
    
    food.markModified("ratings");
    await food.save();

    res.json({ success: true, message: "Rating submitted successfully", averageRating: food.averageRating });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error rating food item" });
  }
};

export { addFood , listfood , removefood, rateFood};
