import connectToDatabase from '../../../lib/db';
import Bill from '../../../models/Bill';
import { authenticate } from '../../../lib/authMiddleware';
import Config from '@/models/Config';

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  await connectToDatabase();
  authenticate(req, res, async () => {
    const userId = req.user
    if (req.method === 'POST') {
      const {
        roomId,
        month,
        previousElectricity,
        currentElectricity,
        electricityRate,
        previousWater,
        currentWater,
        waterRate,
        otherCosts,
        rent,
      } = req.body;

      if (
        !roomId || !month || !previousElectricity || !currentElectricity || !electricityRate ||
        !previousWater || !currentWater || !waterRate || !rent
      ) {
        return res.status(400).json({ message: 'Yêu cầu điền đủ thông tin' });
      }

      const config = await Config.findOne({ userId });

      let electricUsage;
      if (currentElectricity < previousElectricity) {
        electricUsage = (config.maxElectricity - previousElectricity + 1) + parseInt(currentElectricity);
      } else {
        electricUsage = currentElectricity - previousElectricity;
      }

      let waterUsage;
      if (currentWater < previousWater) {
        waterUsage = (config.maxWater - previousWater + 1) + parseInt(currentWater);
      } else {
        waterUsage = currentWater - previousWater;
      }
      const totalElectricityCost = electricUsage * electricityRate;
      const totalWaterCost = waterUsage * waterRate;
      const totalOtherCosts = otherCosts.reduce((acc, cost) => acc + cost.amount, 0);
      const total = totalElectricityCost + totalWaterCost + totalOtherCosts + rent;

      try {
        const newBill = new Bill({
          roomId,
          userId,
          month,
          previousElectricity,
          currentElectricity,
          electricityRate,
          previousWater,
          currentWater,
          waterRate,
          otherCosts,
          rent,
          total,
        });

        const savedBill = await newBill.save();
        return res.status(201).json({ message: 'Tạo mới thành công', savedBill });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    } else if (req.method === 'GET') {
      const userId = req.user;
      const userRole = req.userRole;
      const { roomId, year } = req.query;

      if (!userId) {
        return res.status(400).json({ message: 'Thiếu thông tin userId' });
      }

      if (!roomId) {
        return res.status(400).json({ message: 'Thiếu thông tin roomId' });
      }


      try {
        let bills;
        const yearFilter = year ? { month: { $regex: `-${year}$` } } : {};

        if (userRole === 'admin') {
          // Nếu là admin, lấy tất cả hóa đơn
          bills = await Bill.find({ roomId, ...yearFilter }).sort({ createdAt: 'desc' });
        } else {
          // Nếu không phải admin, chỉ lấy hóa đơn của user đó
          bills = await Bill.find({ userId, roomId, ...yearFilter }).sort({ createdAt: 'desc' });
        }

        return res.status(200).json(bills);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
