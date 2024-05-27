import connectToDatabase from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'POST') {
        const { username, fullname, password, role } = req.body;

        if (!username || !fullname || !password) {
            return res.status(400).json({ message: 'Yêu cầu điền đủ thông tin' });
        }

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                fullname,
                password: hashedPassword,
                role: role || 'test', // Sử dụng vai trò mặc định là 'test' nếu không có vai trò nào được cung cấp
            });

            await newUser.save();
            return res.status(201).json({ message: 'Tạo tài khoản thành công' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
