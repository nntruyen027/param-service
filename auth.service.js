const jwt = require('jsonwebtoken');
const axios = require('axios');

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Không có token' });
        }

        // Gọi auth-service để lấy thông tin người dùng từ token
        const response = await axios.get(`${process.env.AUTH_SERVICE}/self`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;

        const hasAdminRole = user.roles?.some((role) => role.roleName === 'admin');

        if (!hasAdminRole) {
            return res.status(403).json({ message: 'Bạn không có quyền admin' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('[Auth Middleware]', err.message);
        return res.status(401).json({ message: 'Xác thực thất bại' });
    }
};

module.exports = { verifyAdmin };
