const { Resend } = require('resend');

const {
    RESEND_API_KEY,
    EMAIL_FROM = "Secure Voting System <onboarding@resend.dev>",
    NODE_ENV,
} = process.env;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

if (!RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY not configured. Emails will not be sent.");
} else if (NODE_ENV !== "test") {
    console.log("✅ Resend client initialized");
}

async function sendEmail({ to, subject, html }) {
    if (!RESEND_API_KEY) {
        if (NODE_ENV === "development") {
            console.log("------------------------------------------");
            console.log("📧 DEV EMAIL FALLBACK (No API Key Configured)");
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log("Content:");
            console.log(html);
            console.log("------------------------------------------");
            return { message: "Email logged to console (Dev Mode)" };
        }
        console.warn("⚠️ Resend not configured. Email to", to, "was not sent.");
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: EMAIL_FROM,
            to,
            subject,
            html,
        });

        if (error) {
            throw new Error(`Resend Error: ${error.message}`);
        }

        console.log("✅ Email sent to:", to, "| MessageId:", data?.id);
        return data;
    } catch (error) {
        console.error("📧 EMAIL SEND ERROR:", {
            to,
            subject,
            error: error.message
        });
        throw error; // Re-throw so the controller can handle it if needed
    }
}

module.exports = { sendEmail };
