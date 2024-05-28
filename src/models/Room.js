import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status:{
    type: Boolean, //false là đang trống, true là đang thuê
    require: true,
    default: false,
  },
  rent: {
    type: Number,
    required: true,
  },
  electricityRate: {
    type: Number,
    required: true,
  },
  waterRate: {
    type: Number,
    required: true,
  },
  otherCosts: [
    {
      description: String,
      amount: Number,
    },
  ],
  electricity: {
    type: Number,
    required: true,
  },
  water:{
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
RoomSchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
