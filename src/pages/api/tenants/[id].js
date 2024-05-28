import connectToDatabase from '../../../lib/db';
import Tenant from '../../../models/Tenant';
import { authenticate } from '../../../lib/authMiddleware';

export default async function handler(req, res) {
    await connectToDatabase();
    authenticate(req, res, async () => {

        const { id } = req.query;
        const userId = req.user;

        if (req.method === 'PUT') {
            try {
                const updatedTenant = await Tenant.findOneAndUpdate({ _id: id, userId }, req.body, { new: true });
                if (!updatedTenant) {
                    return res.status(404).json({ message: 'Tenant not found' });
                }
                res.status(200).json({ message: "Cập nhật thành công", updatedTenant });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        } else if (req.method === 'DELETE') {
            try {
                const tenant = await Tenant.findOneAndDelete({ _id: id, userId });
                if (!tenant) {
                  return res.status(404).json({ message: 'Tenant not found' });
                }
                res.status(200).json({ message: 'Xoá thành công' });
              } catch (error) {
                res.status(500).json({ message: error.message });
              }
        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    });
}
