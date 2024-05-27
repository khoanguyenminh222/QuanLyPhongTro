import connectToDatabase from '../../../lib/db';
import Room from '../../../models/Room';

export default async function handler(req, res) {
  await connectToDatabase();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const room = await Room.findById(id);
      if (!room) return res.status(404).json({ message: 'Phòng không tồn tại' });
      return res.status(200).json(room);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'PUT') {
    let { name, rent, electricityRate, waterRate, otherCosts, status } = req.body;

    try {
      let updatedRoom;
      if (status !== undefined) {
        // Nếu yêu cầu chứa trường status, cập nhật trạng thái phòng
        updatedRoom = await Room.findByIdAndUpdate(id, { status }, { new: true });
      } else {
        // Nếu không, cập nhật thông tin phòng
        if (!name || !rent || !electricityRate || !waterRate) {
          return res.status(400).json({ message: 'Thiếu thông tin' });
        }
        const existingRoom = await Room.findById(id);
        // Kiểm tra xem tên mới của phòng có trùng với tên của phòng khác không
        if (name !== existingRoom.name) {
          const roomWithSameName = await Room.findOne({ name });
          if (roomWithSameName) {
            return res.status(400).json({ message: 'Tên phòng đã tồn tại' });
          }
        }

        updatedRoom = await Room.findByIdAndUpdate(id, { name, rent, electricityRate, waterRate, otherCosts }, { new: true });
      }

      if (!updatedRoom) return res.status(404).json({ message: 'Phòng không tồn tại' });
      return res.status(200).json({ message: 'Phòng đã được cập nhật', updatedRoom });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedRoom = await Room.findByIdAndDelete(id);
      if (!deletedRoom) return res.status(404).json({ message: 'Phòng không tồn tại' });
      return res.status(200).json({ message: 'Phòng đã được xoá' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
