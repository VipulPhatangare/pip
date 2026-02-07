// Tier Decision Model - Analytics and History
import mongoose from 'mongoose';

const tierDecisionSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  route: {
    type: String,
    required: true
  },
  previousTier: {
    type: String,
    enum: ['A', 'B', 'C', 'D']
  },
  decidedTier: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true
  },
  reason: String,
  confidence: Number,
  metrics: {
    battery: Number,
    batteryCharging: Boolean,
    networkType: String,
    networkDownlink: Number,
    cpuScore: Number,
    fps: Number,
    memory: Number,
    memoryUsed: Number,
    online: Boolean
  },
  consumption: {
    rate: Number,
    minutesRemaining: Number,
    trend: String,
    critical: Boolean
  },
  wasEmergency: {
    type: Boolean,
    default: false
  },
  requiresConsent: {
    type: Boolean,
    default: false
  },
  userConsent: {
    type: String,
    enum: ['accept', 'reject', 'always-optimize', 'never-optimize', null],
    default: null
  },
  autoSwitch: {
    type: Boolean,
    default: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for faster queries
tierDecisionSchema.index({ clientId: 1, timestamp: -1 });
tierDecisionSchema.index({ userId: 1, timestamp: -1 });
tierDecisionSchema.index({ decidedTier: 1, timestamp: -1 });

// Get tier distribution for analytics
tierDecisionSchema.statics.getTierDistribution = async function(startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        timestamp: {
          $gte: startDate || new Date(Date.now() - 24 * 60 * 60 * 1000),
          $lte: endDate || new Date()
        }
      }
    },
    {
      $group: {
        _id: '$decidedTier',
        count: { $sum: 1 },
        avgBattery: { $avg: '$metrics.battery' },
        avgFps: { $avg: '$metrics.fps' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

export default mongoose.model('TierDecision', tierDecisionSchema);
