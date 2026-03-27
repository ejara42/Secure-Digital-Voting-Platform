/**
 * SMS Service using Africa's Talking
 * Africa's Talking has strong coverage for Ethiopia (Ethio Telecom & Safaricom)
 * Sign up at: https://africastalking.com
 */

const AfricasTalking = require("africastalking");

let smsClient = null;

const initSMS = () => {
    if (!process.env.AFRICASTALKING_USERNAME || !process.env.AFRICASTALKING_API_KEY) {
        console.warn("⚠️  Africa's Talking credentials not set — SMS disabled, falling back to email only.");
        return null;
    }

    const at = AfricasTalking({
        apiKey: process.env.AFRICASTALKING_API_KEY,
        username: process.env.AFRICASTALKING_USERNAME,
    });

    return at.SMS;
};

smsClient = initSMS();

/**
 * Send an SMS message.
 * @param {string} phone - Recipient phone number in E.164 format e.g. +251911000000
 * @param {string} message - Text message body
 * @returns {Promise<boolean>}
 */
const sendSMS = async (phone, message) => {
    if (!smsClient) {
        console.warn(`[SMS] Skipped (not configured). Would have sent to ${phone}: ${message}`);
        return false;
    }

    // Normalize Ethiopian numbers: 09xx → +2519xx
    let normalized = phone.replace(/\s+/g, "");
    if (normalized.startsWith("09")) {
        normalized = "+251" + normalized.slice(1);
    } else if (normalized.startsWith("9") && normalized.length === 9) {
        normalized = "+251" + normalized;
    }

    try {
        const result = await smsClient.send({
            to: [normalized],
            message,
            from: process.env.AFRICASTALKING_SENDER_ID || "ENBE-Vote",
        });

        const recipient = result.SMSMessageData?.Recipients?.[0];
        if (recipient?.status === "Success") {
            console.log(`[SMS] Sent to ${normalized}`);
            return true;
        } else {
            console.error(`[SMS] Failed to ${normalized}:`, recipient?.status);
            return false;
        }
    } catch (err) {
        console.error("[SMS] Error:", err.message);
        return false;
    }
};

/**
 * Send an OTP via SMS
 * @param {string} phone
 * @param {string} otp
 */
const sendOTPSms = (phone, otp) => {
    const message =
        `Your ENBE Digital Election OTP is: ${otp}\n` +
        `Valid for 10 minutes. DO NOT share this code.\n` +
        `Ethiopia National Election Board`;
    return sendSMS(phone, message);
};

module.exports = { sendSMS, sendOTPSms };
