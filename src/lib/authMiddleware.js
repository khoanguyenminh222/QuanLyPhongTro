import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const config = {
    api: {
        externalResolver: true,
    },
};

export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Không có quyền truy cập' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ' });
    }
};
