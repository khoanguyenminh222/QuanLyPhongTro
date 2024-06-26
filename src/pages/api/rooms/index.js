import connectToDatabase from '../../../lib/db';
import Room from '../../../models/Room';
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
      const userId = req.user;
      const userRole = req.userRole;
      if (!userId) {
        return res.status(400).json({ message: 'Thiếu thông tin userId' });
      }

      try {
        let rooms;
        if (userRole === 'admin') {
          rooms = await Room.find().populate("userId"); // Nếu là admin, lấy tất cả phòng
        } else {
          rooms = await Room.find({ userId }); // Nếu là user, chỉ lấy phòng của user đó
        }
        return res.status(200).json(rooms);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    } else if (req.method === 'POST') {
      const userId = req.user;

      let { name, rent, electricityRate, waterRate, otherCosts, electricity, water } = req.body;
      
      if (!name || !rent || !electricityRate || !waterRate || !electricity || !water) {
        return res.status(400).json({ message: "Thiếu thông tin" });
      }

      // Kiểm tra xem tên phòng đã tồn tại trong cơ sở dữ liệu chưa
      const existingRoom = await Room.findOne({ name, userId });
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
          status: false,
          electricity,
          water,
          userId,
        });

        const savedRoom = await newRoom.save();
        return res.status(201).json({ message: 'Tạo phòng thành công', savedRoom });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
