import userModel from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import { sendEmail } from "../Config/email.js";

const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success : false , message : "User not found"});
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.json({success : false , message : "Invalid password"});
        }

        // If explicitly unverified, prompt to verify first
        if (user.isVerified === false) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.registerOtp = otp;
            user.registerOtpExpires = Date.now() + 300000;
            await user.save();

            const emailSent = await sendEmail(
                email,
                "Cravella Account Verification OTP 🍕",
                `Hello ${user.name},\n\nYour account is not verified yet. Your verification OTP is: ${otp} 🔑\n\nWelcome to our food community! Enter this code to activate your account and start ordering delicious meals! 😋🍔🍕\n\nBest regards,\nCravella Team`
            );

            return res.json({
                success: true,
                isNotVerified: true,
                otpRequired: true,
                message: emailSent ? "Verification OTP sent to your email." : "Verification OTP generated. (Email sending failed)"
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.loginOtp = otp;
        user.loginOtpExpires = Date.now() + 300000; // 5 minutes

        await user.save();

        const emailSent = await sendEmail(
            email,
            "Cravella Login Verification OTP 🍕",
            `Hello ${user.name},\n\nYour OTP for verifying your login is: ${otp} 🔑\n\nHere is your secret key to deliciousness! It is valid for 5 minutes. Grab your favorite foods and let's satisfy those cravings! 😋🍔🍕\n\nBest regards,\nCravella Team`
        );

        res.json({
            success: true,
            otpRequired: true,
            message: emailSent ? "OTP sent to your email." : "OTP generated. (Email sending failed. Contact admin or check env variables)"
        });
    } catch(err) {
        console.log(err);
        res.json({success : false , message : "Error logging in user"});
    }
}

// Verify Login OTP
const verifyLoginOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.loginOtp || user.loginOtp !== otp || user.loginOtpExpires < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        // Clear OTP fields
        user.loginOtp = undefined;
        user.loginOtpExpires = undefined;
        await user.save();

        const token = createToken(user._id);

        // Send successful login notification email
        await sendEmail(
            user.email,
            "Cravella Successful Login Alert",
            `Hello ${user.name},\n\nWe detected a successful login to your Cravella account.\n\nDate/Time: ${new Date().toLocaleString()}\n\nIf this was not you, please reset your password immediately to secure your account.\n\nBest regards,\nCravella Team`
        );

        res.json({ success: true, token, message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error verifying OTP" });
    }
}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET);
}

//register user
const registerUser = async (req,res) => {
    const {name,email,password} = req.body;
    try {
        //checking if user already exist
        let user = await userModel.findOne({email});
        if (user && user.isVerified !== false) {
            return res.json({success : false , message : "User already exist"});
        }

        //validating email format and strong password
        if(!validator.isEmail(email)){
            return res.json({success : false , message : "Please enter a valid email"});
        }
        if(password.length < 8){
            return res.json({success : false , message : "Please enter a strong password"});
        }

        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        if (user) {
            // Update unverified user details
            user.name = name;
            user.password = hashedPassword;
            user.registerOtp = otp;
            user.registerOtpExpires = Date.now() + 300000; // 5 minutes
            await user.save();
        } else {
            //creating new user
            user = new userModel({
                name : name,
                email : email,
                password : hashedPassword,
                registerOtp: otp,
                registerOtpExpires: Date.now() + 300000,
                isVerified: false
            });
            await user.save();
        }

        const emailSent = await sendEmail(
            email,
            "Cravella Account Verification OTP 🍕",
            `Hello ${name},\n\nYour OTP for verifying your new Cravella account is: ${otp} 🔑\n\nWelcome to our food community! Enter this code to activate your account and start ordering delicious meals! 😋🍔🍕\n\nBest regards,\nCravella Team`
        );

        res.json({
            success: true,
            otpRequired: true,
            message: emailSent ? "Verification OTP sent to your email." : "Verification OTP generated. (Email sending failed)"
        });

    } catch(err) {
        console.log(err);
        res.json({success : false , message : "Error registering user"});
    }
}

// Verify Registration OTP
const verifyRegisterOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.json({ success: false, message: "Account already verified. Please sign in." });
        }

        if (!user.registerOtp || user.registerOtp !== otp || user.registerOtpExpires < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        // Mark as verified and clear OTP
        user.isVerified = true;
        user.registerOtp = undefined;
        user.registerOtpExpires = undefined;
        await user.save();

        const token = createToken(user._id);

        // Send welcome email
        await sendEmail(
            user.email,
            "Welcome to Cravella! 🎉",
            `Hello ${user.name},\n\nYour Cravella account has been successfully verified! 🎉\n\nWelcome to Cravella - "Every Craving, delivered". Start exploring gourmet dishes and order your favorites now!\n\nBest regards,\nCravella Team`
        );

        res.json({ success: true, token, message: "Account verified successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error verifying registration OTP" });
    }
}

// get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                address: user.address || {},
                avatar: user.avatar || ""
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching user profile" });
    }
}

// update user profile
const updateUserProfile = async (req, res) => {
    const { name, address, avatar } = req.body;
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        if (name) user.name = name;
        if (address) {
            user.address = address;
            user.markModified("address");
        }
        if (avatar !== undefined) {
            user.avatar = avatar;
        }
        
        await user.save();
        res.json({ 
            success: true, 
            message: "Profile updated successfully", 
            data: { 
                name: user.name, 
                address: user.address,
                avatar: user.avatar || ""
            } 
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating user profile" });
    }
}

// Toggle Favorite
const toggleFavorite = async (req, res) => {
    try {
        const { foodId } = req.body;
        const user = await userModel.findById(req.user.userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        const index = user.favorites.indexOf(foodId);
        if (index > -1) {
            user.favorites.splice(index, 1);
        } else {
            user.favorites.push(foodId);
        }
        await user.save();
        res.json({ success: true, message: index > -1 ? "Removed from favorites" : "Added to favorites", favorites: user.favorites });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error toggling favorite" });
    }
}

// Get Favorites
const getFavorites = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).populate('favorites');
        if (!user) return res.json({ success: false, message: "User not found" });
        res.json({ success: true, data: user.favorites });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching favorites" });
    }
}

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User with this email does not exist." });
        }

        // Generate 6-digit Reset OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpires = Date.now() + 900000; // 15 minutes

        await user.save();

        const emailSent = await sendEmail(
            email,
            "Cravella Password Reset OTP 🔑",
            `Hello ${user.name},\n\nYour OTP for resetting your password is: ${otp} 🍩\n\nDon't worry, we've got you covered! Enter this code to set a new password and get back to ordering your favorites! 🍦🥞🍕\n\nBest regards,\nCravella Team`
        );

        res.json({ 
            success: true, 
            message: emailSent ? "Password reset OTP sent to your email." : "OTP generated. (Email sending failed. Contact admin or check env variables)"
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error generating password reset OTP." });
    }
}

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        const user = await userModel.findOne({ 
            email,
            resetOtp: otp, 
            resetOtpExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.json({ success: false, message: "Password reset OTP is invalid or has expired." });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (min 8 chars)." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.resetOtpExpires = undefined;

        await user.save();
        res.json({ success: true, message: "Password has been reset successfully." });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error resetting password." });
    }
}

// Resend OTP
const resendOtp = async (req, res) => {
    const { email, type } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        if (type === "register") {
            user.registerOtp = otp;
            user.registerOtpExpires = Date.now() + 300000; // 5 mins
            await user.save();

            const emailSent = await sendEmail(
                email,
                "Cravella Account Verification OTP 🍕",
                `Hello ${user.name},\n\nYour new verification OTP is: ${otp} 🔑\n\nEnter this code to activate your account and start ordering delicious meals! 😋🍔🍕\n\nBest regards,\nCravella Team`
            );
            return res.json({ success: true, message: emailSent ? "Verification OTP resent to your email." : "OTP generated. (Email sending failed)" });
        }

        if (type === "login") {
            user.loginOtp = otp;
            user.loginOtpExpires = Date.now() + 300000; // 5 mins
            await user.save();

            const emailSent = await sendEmail(
                email,
                "Cravella Login Verification OTP 🍕",
                `Hello ${user.name},\n\nYour new OTP for verifying your login is: ${otp} 🔑\n\nGrab your favorite foods and let's satisfy those cravings! 😋🍔🍕\n\nBest regards,\nCravella Team`
            );
            return res.json({ success: true, message: emailSent ? "Login OTP resent to your email." : "OTP generated. (Email sending failed)" });
        }

        if (type === "reset") {
            user.resetOtp = otp;
            user.resetOtpExpires = Date.now() + 900000; // 15 mins
            await user.save();

            const emailSent = await sendEmail(
                email,
                "Cravella Password Reset OTP 🔑",
                `Hello ${user.name},\n\nYour new OTP for resetting your password is: ${otp} 🍩\n\nBest regards,\nCravella Team`
            );
            return res.json({ success: true, message: emailSent ? "Reset OTP resent to your email." : "OTP generated. (Email sending failed)" });
        }

        res.json({ success: false, message: "Invalid OTP type" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error resending OTP" });
    }
}

export {loginUser, verifyLoginOtp, registerUser, verifyRegisterOtp, getUserProfile, updateUserProfile, toggleFavorite, getFavorites, forgotPassword, resetPassword, resendOtp};