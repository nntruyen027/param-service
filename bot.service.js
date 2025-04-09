const axios = require('axios');
const crypto = require('crypto');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OTP_STORE = new Map();

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

exports.sendOtp = async (userId, chatId) => {
    const otp = generateOtp();
    OTP_STORE.set(`otp:${userId}`, otp);

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: `🔐 Mã xác thực OTP của bạn là: *${otp}*`,
        parse_mode: 'Markdown'
    });

    setTimeout(() => OTP_STORE.delete(`otp:${userId}`), 3 * 60 * 1000); // Hết hạn sau 3 phút
};

exports.verifyOtp = (userId, otp) => {
    const stored = OTP_STORE.get(`otp:${userId}`);
    return stored && stored === otp;
};
