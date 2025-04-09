const { verifyOtp } = require('./bot.service');

module.exports = (req, res, next) => {
    const otpToken = req.headers['otp-token'];
    const userId = req.user.id;

    if (!otpToken) return res.status(400).json({ message: 'Thiếu mã OTP' });

    if (!verifyOtp(userId, otpToken)) {
        return res.status(403).json({ message: 'OTP không đúng hoặc đã hết hạn' });
    }

    next();
};
