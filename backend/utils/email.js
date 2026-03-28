const nodemailer = require("nodemailer");

const {
    EMAIL_HOST,
    EMAIL_PORT = 587,
    EMAIL_SECURE = "false",
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM,
    NODE_ENV,
} = process.env;

if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    console.warn("⚠️ SMTP not configured. Emails will not be sent.");
}

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: EMAIL_SECURE === "true",
    auth: EMAIL_USER && EMAIL_PASS ? {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    } : undefined,
    pool: true,
    maxConnections: 5,
    tls: { rejectUnauthorized: true },
});

if (NODE_ENV !== "test" && EMAIL_HOST) {
    transporter.verify()
        .then(() => console.log("✅ SMTP verified"))
        .catch(err => console.warn("❌ SMTP verify failed:", err.message));
}

async function sendEmail({ to, subject, html }) {
    if (!EMAIL_HOST) {
        if (NODE_ENV === "development") {
            console.log("------------------------------------------");
            console.log("📧 DEV EMAIL FALLBACK (No SMTP Configured)");
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log("Content:");
            console.log(html);
            console.log("------------------------------------------");
            return { message: "Email logged to console (Dev Mode)" };
        }
        console.warn("⚠️ SMTP not configured. Email to", to, "was not sent.");
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: EMAIL_FROM || "Secure Voting System <no-reply@securevoting.com>",
            to,
            subject,
            html,
        });
        console.log("✅ Email sent to:", to, "| MessageId:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Failed to send email to:", to);
        console.error("Error Detail:", error.message);
        throw error; // Re-throw so the controller can handle it if needed
    }
}

module.exports = { sendEmail };
