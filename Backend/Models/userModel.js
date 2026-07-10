import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {type : String , required : true},
    email : {type : String , required : true , unique : true},
    password : {type : String , required : true},
    cartData:{type:Object,default:{}},
    avatar:{type:String, default:""},
    address: {type:Object, default:{}},
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'food' }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    loginOtp: { type: String },
    loginOtpExpires: { type: Date },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    registerOtp: { type: String },
    registerOtpExpires: { type: Date }
},{minimize:false});

const userModel = mongoose.model.user || mongoose.model("user" , userSchema);

export default userModel;