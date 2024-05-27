import connectToDatabase from '../../../lib/db';
import Room from '../../../models/Room';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const rooms = await Room.find({});
      return res.status(200).json(rooms);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    let { name, rent, electricityRate, waterRate, otherCosts } = req.body;

    if (!name || !rent || !electricityRate || !waterRate) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    // Kiểm tra xem tên phòng đã tồn tại trong cơ sở dữ liệu chưa
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ message: 'Tên phòng đã tồn tại' });
    }
    
    try {
      const newRoom = new Room({
        name,
        rent,
        electricityRate,
        waterRate,
        otherCosts,
        status: false
      });

      const savedRoom = await newRoom.save();
      return res.status(201).json({ message:'Tạo phòng thành công', savedRoom});
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}