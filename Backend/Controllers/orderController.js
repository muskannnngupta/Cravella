import orderModel from "../Models/orderModel.js";
import userModel from "../Models/userModel.js";
import Stripe from "stripe"

const placeorder = async(req,res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    // Dynamically detect frontend origin to support both localhost and Vercel redirects
    const frontend_url = req.headers.origin || "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId : req.user.userId,
            items: req.body.items,
            amount : req.body.amount,
            address : req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.user.userId,{cartData : {}});

        const discountFactor = req.body.promoDiscount ? (1 - Number(req.body.promoDiscount) / 100) : 1;

        const line_items = req.body.items.map((item) => ({
             price_data:{
                currency:"inr",
                product_data: {
                    name : item.name
                },
                unit_amount : Math.round(item.price * 100*80 * discountFactor)
            },
            quantity : item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100*80
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode : 'payment',
            success_url:`${frontend_url}/verify?success=true&order=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&order=${newOrder._id}`
        })

        res.json({sucess:true,session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({sucess:false,message:"error"});
    }

}

const verifyOrder = async (req,res) => {

    const{orderId,success} = req.body;
    try {
        if (success=="true") {

            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"paid"})

        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"not paid"});
        }
    } catch (error) {
        console.log("error");
        res.json({success:false,message:"error"});
    }

}

const userOrder = async(req,res) => {

    try {
        const order = await orderModel.find({userId:req.user.userId}).sort({date:-1})
        res.json({success:true,data:order});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const listorders = async(req,res) => {

    try {
        const orders = await orderModel.find({}).sort({date:-1});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }

}

const updateStatus = async(req,res) => {
    try {
        const order = await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        if (req.io && order) {
            req.io.to(order.userId.toString()).emit('orderStatusUpdate', {
                orderId: order._id,
                status: req.body.status
            });
        }
        res.json({success:true,message:"Status Updated"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export {placeorder,verifyOrder,userOrder,listorders,updateStatus}