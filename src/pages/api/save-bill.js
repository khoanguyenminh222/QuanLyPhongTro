import connectToDatabase from '../../lib/db';
import Bill from '../../models/Bill';

export default async function handler(req, res) {
  await connectToDatabase();

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
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const totalElectricityCost = (currentElectricity - previousElectricity) * electricityRate;
    const totalWaterCost = (currentWater - previousWater) * waterRate;
    const totalOtherCosts = otherCosts.reduce((acc, cost) => acc + cost.amount, 0);
    const total = totalElectricityCost + totalWaterCost + totalOtherCosts + rent;

    try {
      const newBill = new Bill({
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
        total,
      });

      const savedBill = await newBill.save();
      return res.status(201).json(savedBill);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save bill' });
    }
  } else if (req.method === 'GET') {
    try {
      const bills = await Bill.find({});
      return res.status(200).json(bills);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch bills' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
