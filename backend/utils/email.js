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
    if (!EMAIL_HOST) return;

    return transporter.sendMail({
        from: EMAIL_FROM,
        to,
        subject,
        html,
    });
}

module.exports = { sendEmail };
