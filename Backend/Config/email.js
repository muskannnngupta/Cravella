import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'dns';

// Force Node to resolve IPv4 addresses first (avoids ENETUNREACH IPv6 issue on Render)
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const sendEmail = async (to, subject, text) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("WARNING: EMAIL_USER and EMAIL_PASS environment variables are not set in Backend/.env.");
            return false;
        }

        // Dynamically resolve smtp.gmail.com to IPv4 address only
        const smtpIp = await new Promise((resolve) => {
            dns.resolve4('smtp.gmail.com', (err, addresses) => {
                if (err || !addresses || !addresses.length) {
                    // Fallback to a known stable Gmail SMTP IPv4 address if DNS lookup fails
                    resolve('74.125.142.108');
                } else {
                    resolve(addresses[0]);
                }
            });
        });

        console.log(`[SMTP] Resolved smtp.gmail.com to IPv4 address: ${smtpIp}`);
        
        const transporter = nodemailer.createTransport({
            host: smtpIp,
            port: 587,
            secure: false, // Use STARTTLS on port 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                servername: 'smtp.gmail.com' // Crucial for valid SSL certificate handshake
            }
        });

        const mailOptions = {
            from: `"Cravella Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: ", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};

export { sendEmail };
