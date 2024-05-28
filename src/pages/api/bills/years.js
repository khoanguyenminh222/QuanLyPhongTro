import connectToDatabase from '../../../lib/db';
import Bill from '../../../models/Bill';
import { authenticate } from '../../../lib/authMiddleware';

export const config = {
    api: {
        externalResolver: true,
    },
};

export default async function handler(req, res) {
    await connectToDatabase();
    authenticate(req, res, async () => {
        if (req.method === 'GET') {
            try {
                const bills = await Bill.find({}, 'month'); // Lấy toàn bộ các bản ghi và chỉ lấy trường month
                const uniqueYears = new Set(); // Sử dụng Set để lưu trữ các năm duy nhất
                bills.forEach(bill => {
                    const year = parseInt(bill.month.split('-')[2]); // Tách năm từ chuỗi month và chuyển đổi thành số nguyên
                    uniqueYears.add(year);
                });
                const sortedUniqueYears = [...uniqueYears].sort((a, b) => b - a); // Chuyển Set thành mảng và sắp xếp các năm giảm dần
                return res.status(200).json(sortedUniqueYears);
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    });
}
