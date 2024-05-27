import connectToDatabase from '../../../lib/db';
import Room from '../../../models/Room';

export default async function handler(req, res) {
  await connectToDatabase();

  authenticate(req, res, async () => {
    const { id, userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'Thiếu thông tin userId' });
    }

    if (req.method === 'GET') {
      try {
        const room = await Room.findOne({ _id: id, userId: userId });
        if (!room) return res.status(404).json({ message: 'Phòng không tồn tại hoặc không thuộc về người dùng này' });
        return res.status(200).json(room);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    } else if (req.method === 'PUT') {
      let { name, rent, electricityRate, waterRate, otherCosts, status, electricity, water } = req.body;

      try {
        let updatedRoom;
        const room = await Room.findOne({ _id: id, userId: userId });
        if (!room) return res.status(404).json({ message: 'Phòng không tồn tại hoặc không thuộc về người dùng này' });
        if (status !== undefined) {
          // Nếu yêu cầu chứa trường status, cập nhật trạng thái phòng
          updatedRoom = await Room.findByIdAndUpdate(id, { status }, { new: true });
        } else {
          // Nếu không, cập nhật thông tin phòng
          if (!name || !rent || !electricityRate || !waterRate || !electricity || !water) {
            return res.status(400).json({ message: 'Thiếu thông tin' });
          }

          // Kiểm tra xem tên mới của phòng có trùng với tên của phòng khác không
          if (name !== room.name) {
            const roomWithSameName = await Room.findOne({ name, userId: userId });
            if (roomWithSameName) {
              return res.status(400).json({ message: 'Tên phòng đã tồn tại' });
            }
          }

          updatedRoom = await Room.findByIdAndUpdate(id, { name, rent, electricityRate, waterRate, otherCosts, electricity, water }, { new: true });
        }

        if (!updatedRoom) return res.status(404).json({ message: 'Phòng không tồn tại' });
        return res.status(200).json({ message: 'Phòng đã được cập nhật', updatedRoom });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    } else if (req.method === 'DELETE') {
      try {
        const room = await Room.findOne({ _id: id, userId: userId });
        if (!room) return res.status(404).json({ message: 'Phòng không tồn tại hoặc không thuộc về người dùng này' });

        await Room.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Phòng đã được xoá' });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  });
}
