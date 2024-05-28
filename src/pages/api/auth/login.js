import connectToDatabase from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'POST') {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Yêu cầu điền đủ thông tin' });
        }

        try {
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Tên người dùng hoặc mật khẩu không đúng' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Tên người dùng hoặc mật khẩu không đúng' });
            }

            const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
            return res.status(200).json({ message: 'Đăng nhập thành công', token });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
