import userModel from "../Models/userModel.js";

const addToCart = async (req, res) => {

    try{
        console.log("Adding to cart - User ID:", req.user.userId, "Item ID:", req.body.itemId);
        
        let userdata = await userModel.findById(req.user.userId);
        if(!userdata){
            return res.status(404).json({success: false, message: "User not found"});
        }
        
        let cartdata = userdata.cartData;
        if(!cartdata[req.body.itemId]){
            cartdata[req.body.itemId] = 1;
        }
        else{
            cartdata[req.body.itemId] += 1;
        }
        
        console.log("Cart data before save:", cartdata);
        userdata.cartData = cartdata;
        userdata.markModified("cartData");
        const result = await userdata.save();
        console.log("Save result:", result.cartData);
        
        res.status(200).json({success: true, message: "Item added to cart"});
    }catch(error){  
        console.error("Error adding to cart:", error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

const removeFromCart = async (req, res) => {

    try{
        let userdata = await userModel.findById(req.user.userId);
        if(!userdata){
            return res.status(404).json({success: false, message: "User not found"});
        }
        
        let cartdata = userdata.cartData;
        if(cartdata[req.body.itemId]>0){
            cartdata[req.body.itemId] -= 1;
        }
        userdata.cartData = cartdata;
        userdata.markModified("cartData");
        await userdata.save();
        res.status(200).json({success: true, message: "Item removed from cart"});
    }catch(error){
        console.error("Error removing from cart:", error);
        res.status(500).json({success: false, message: "Internal server error"});
    }

}

const getCart = async (req, res) => {

    try{
        let userdata = await userModel.findById(req.user.userId);
        if(!userdata){
            return res.status(404).json({success: false, message: "User not found"});
        }
        
        let cartdata = userdata.cartData;
        res.status(200).json({success: true, cartdata});
    }
    catch(error){
        console.error("Error getting cart:", error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export {addToCart, removeFromCart, getCart}