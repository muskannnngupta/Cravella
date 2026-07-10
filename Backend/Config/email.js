import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (to, subject, text) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn("WARNING: RESEND_API_KEY environment variable is not set.");
            return false;
        }

        console.log(`[Email] Sending email to ${to} via Resend HTTP API...`);

        // Send email via Resend REST API (uses standard port 443, bypassed by Render firewall)
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Cravella <onboarding@resend.dev>', // Resend sandbox testing sender
                to: [to],
                subject,
                text
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Email sent successfully via Resend:", data.id);
            return true;
        } else {
            console.error("Resend API error response:", data);
            return false;
        }
    } catch (error) {
        console.error("Error sending email via Resend:", error);
        return false;
    }
};

export { sendEmail };
