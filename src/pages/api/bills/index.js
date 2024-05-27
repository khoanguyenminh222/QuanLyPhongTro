import connectToDatabase from '../../lib/db';
import Bill from '../../models/Bill';

export default async function handler(req, res) {
  await connectToDatabase();
  authenticate(req, res, async () => {
    if (req.method === 'POST') {
      const {
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
      } = req.body;

      if (
        !roomId || !month || !previousElectricity || !currentElectricity || !electricityRate ||
        !previousWater || !currentWater || !waterRate || !rent
      ) {
        return res.status(400).json({ message: 'Yêu cầu điền đủ thông tin' });
      }

      const totalElectricityCost = (currentElectricity - previousElectricity) * electricityRate;
      const totalWaterCost = (currentWater - previousWater) * waterRate;
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
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: 'Thiếu thông tin userId' });
      }
      try {
        const bills = await Bill.find({ userId });
        return res.status(200).json(bills);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
