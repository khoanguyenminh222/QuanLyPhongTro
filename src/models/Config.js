import mongoose from 'mongoose';

const ConfigSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    maxElectricity: {
        type: Number,
        required: true,
        default: 9999,
    },
    maxWater: {
        type: Number,
        required: true,
        default: 9999,
    },
});

export default mongoose.models.Config || mongoose.model('Config', ConfigSchema);
