import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Other'
  },
  healthInsuranceId: {
    type: String,
  },
  currentAddress: {
    type: String,
  },
  idCardNumber: {
    type: String,
  },
  phone: {
    type: String,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
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

export default mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);
