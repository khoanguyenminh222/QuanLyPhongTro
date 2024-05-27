import connectToDatabase from '../../../lib/db';
import User from '../../../models/User';
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
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ message: 'Thiếu thông tin userId' });
            }

            try {
                const user = await User.findById(id);
                if (!user) {
                    return res.status(404).json({ message: 'Không tìm thấy user' });
                }
                return res.status(200).json(user);
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    });
}
