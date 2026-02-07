// Booking Model - Visit Appointments
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  visitTime: {
    type: String,
    required: true
  },
  contactInfo: {
    name: String,
    email: String,
    phone: String
  },
  message: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  confirmedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Confirm booking
bookingSchema.methods.confirm = function() {
  this.status = 'confirmed';
  this.confirmedAt = Date.now();
  return this.save();
};

// Cancel booking
bookingSchema.methods.cancel = function(reason) {
  this.status = 'cancelled';
  this.cancelledAt = Date.now();
  this.cancellationReason = reason;
  return this.save();
};

export default mongoose.model('Booking', bookingSchema);
