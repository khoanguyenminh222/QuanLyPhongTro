import connectToDatabase from '../../../lib/db';
import Tenant from '../../../models/Tenant';
import { authenticate } from '../../../lib/authMiddleware';

export default async function handler(req, res) {
    await connectToDatabase();

    authenticate(req, res, async () => {
        const userId = req.user;
        const userRole = req.userRole;
        if (req.method === 'POST') {
            let {
                name, dob, gender, healthInsuranceId, currentAddress, idCardNumber, phoneNumber, roomId,
              } = req.body;
              if (!name || !roomId) {
                return res.status(400).json({ message: 'Yêu cầu điền đủ thông tin' });
              }
      
              try {
                const newTenant = new Tenant({
                  name, dob, gender, healthInsuranceId, currentAddress, idCardNumber, phoneNumber, roomId, userId,
                });
                const savedTenant = await newTenant.save();
                res.status(201).json(savedTenant);
              } catch (error) {
                res.status(500).json({ message: error.message });
              }
        } else if (req.method === 'GET') {
            const { roomId } = req.query;

            if (!roomId) {
                return res.status(400).json({ message: 'Thiếu thông tin roomId' });
            }

            try {
                let tenants;
                if (userRole === 'admin') {
                    tenants = await Tenant.find({ roomId });
                } else {
                    tenants = await Tenant.find({ roomId, userId });
                }
                return res.status(200).json(tenants);
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    });
}
