import connectToDatabase from '../../../lib/db';
import Config from '../../../models/Config';
import { authenticate } from '../../../lib/authMiddleware';

export const config = {
    api: {
        externalResolver: true,
    },
};

export default async function handler(req, res) {
    await connectToDatabase();

    authenticate(req, res, async () => {
        const userId = req.user;

        if (req.method === 'GET') {
            try {
                const config = await Config.findOne({ userId });
                if (!config) {
                    return res.status(404).json({ message: 'Config not found' });
                }
                return res.status(200).json(config);
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        } else if (req.method === 'POST') {
            const { maxElectricity, maxWater } = req.body;
            if (maxElectricity === undefined || maxWater === undefined) {
                return res.status(400).json({ message: 'Missing maxElectricity or maxWater' });
            }

            try {
                let config = await Config.findOne({ userId });
                if (!config) {
                    config = new Config({ userId, maxElectricity, maxWater });
                } else {
                    config.maxElectricity = maxElectricity;
                    config.maxWater = maxWater;
                }
                await config.save();
                return res.status(200).json({ message: 'Thiết lặp đã được lưu', config });
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    });
}
