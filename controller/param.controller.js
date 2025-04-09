const Param = require('../model/param.model');

// Tự động parse kiểu value dựa vào dataType
const parseValue = (dataType, value) => {
    try {
        switch (dataType) {
            case 'number':
                return Number(value);
            case 'boolean':
                return value === 'true' || value === true;
            case 'json':
                return typeof value === 'object' ? value : JSON.parse(value);
            case 'string':
            default:
                return String(value);
        }
    } catch (e) {
        console.warn('Lỗi parseValue:', e.message);
        return value;
    }
};

exports.getAll = async (req, res) => {
    try {
        const {
            page = 0,
            size = 10,
            sort = 'createdAt,desc',
            keyword = '',
        } = req.query;

        const [sortField, sortOrder] = sort.split(',');
        const skip = Number(page) * Number(size);

        const query = keyword
            ? { key: { $regex: keyword, $options: 'i' } }
            : {};

        const [content, totalElements] = await Promise.all([
            Param.find(query)
                .sort({ [sortField]: sortOrder === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(Number(size)),
            Param.countDocuments(query),
        ]);

        const totalPages = Math.ceil(totalElements / size);

        res.json({
            content,
            page: Number(page),
            size: Number(size),
            totalElements,
            totalPages,
            last: Number(page) + 1 >= totalPages,
        });
    } catch (err) {
        console.error('Lỗi getAll:', err);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tham số' });
    }
};

exports.getOne = async (req, res) => {
    try {
        const param = await Param.findById(req.params.id);
        if (!param) return res.status(404).json({ message: 'Không tìm thấy tham số' });
        res.json(param);
    } catch (err) {
        console.error('Lỗi getOne:', err);
        res.status(500).json({ message: 'Lỗi khi lấy tham số' });
    }
};

exports.create = async (req, res) => {
    try {
        const { key, dataType, value } = req.body;
        const param = new Param({ key, dataType, value: parseValue(dataType, value) });
        await param.save();
        res.status(201).json(param);
    } catch (err) {
        console.error('Lỗi create:', err);
        res.status(500).json({ message: 'Không thể tạo tham số' });
    }
};

exports.update = async (req, res) => {
    try {
        const { dataType, value } = req.body;
        const param = await Param.findByIdAndUpdate(
            req.params.id,
            { ...req.body, value: parseValue(dataType, value) },
            { new: true }
        );
        if (!param) return res.status(404).json({ message: 'Không tìm thấy tham số' });
        res.json(param);
    } catch (err) {
        console.error('Lỗi update:', err);
        res.status(500).json({ message: 'Không thể cập nhật tham số' });
    }
};

exports.remove = async (req, res) => {
    try {
        const param = await Param.findByIdAndDelete(req.params.id);
        if (!param) return res.status(404).json({ message: 'Không tìm thấy tham số' });
        res.json({ message: 'Đã xoá tham số' });
    } catch (err) {
        console.error('Lỗi remove:', err);
        res.status(500).json({ message: 'Không thể xoá tham số' });
    }
};

exports.sendOtp = async (req, res) => {
    const user = req.user;
    const chatId = process.env.TEST_TELEGRAM_CHAT_ID || '123456789';

    try {
        await sendOtp(user.id, chatId);
        res.json({ message: 'Đã gửi OTP qua Telegram' });
    } catch (e) {
        console.error('Lỗi sendOtp:', e);
        res.status(500).json({ message: 'Không thể gửi OTP' });
    }
};

exports.getValueByKey = async (req, res) => {
    try {
        const key = req.params.key;

        const param = await Param.findOne({ key });
        if (!param) return res.status(404).json({ message: 'Không tìm thấy tham số' });

        const parsedValue = parseValue(param.dataType, param.value);

        res.json({
            key: param.key,
            value: parsedValue,
        });
    } catch (err) {
        console.error('Lỗi getValueByKey:', err);
        res.status(500).json({ message: 'Không thể lấy tham số theo key' });
    }
};
