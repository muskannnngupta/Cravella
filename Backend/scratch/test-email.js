import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log("Testing email configuration...");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to self
    subject: "SMTP Test Email",
    text: "This is a test email from Cravella."
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Test failed!");
        console.error(error);
    } else {
        console.log("Test succeeded!");
        console.log("Email sent: " + info.response);
    }
});
