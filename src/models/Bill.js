import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  previousElectricity: {
    type: Number,
    required: true,
  },
  currentElectricity: {
    type: Number,
    required: true,
  },
  electricityRate: {
    type: Number,
    required: true,
  },
  previousWater: {
    type: Number,
    required: true,
  },
  currentWater: {
    type: Number,
    required: true,
  },
  waterRate: {
    type: Number,
    required: true,
  },
  otherCosts: [
    {
      amount: Number,
      note: String,
    },
  ],
  rent: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Bill || mongoose.model('Bill', BillSchema);
