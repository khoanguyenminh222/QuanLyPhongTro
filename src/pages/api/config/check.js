// pages/api/config/check.js
import { authenticate } from '@/lib/authMiddleware';
import connectToDatabase from '../../../lib/db';
import Config from '../../../models/Config';

export default async function handler(req, res) {
    await connectToDatabase();

    authenticate(req, res, async () => {
        if (req.method === 'GET') {
            const userId = req.user;

            try {
                const config = await Config.findOne({ userId });
                if (config) {
                    return res.status(200).json({ configured: true });
                } else {
                    return res.status(200).json({ configured: false });
                }
            } catch (error) {
                return res.status(500).json({ error: 'Failed to check config' });
            }
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    });
}
