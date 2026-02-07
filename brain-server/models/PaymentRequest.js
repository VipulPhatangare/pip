// Payment Request Model
import mongoose from 'mongoose';

const paymentRequestSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentType: {
    type: String,
    enum: ['deposit', 'booking', 'rent', 'purchase', 'installment', 'other'],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'check', 'crypto', 'other'],
    default: 'credit_card'
  },
  contactInfo: {
    name: String,
    email: String,
    phone: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  paymentGateway: String,
  paymentDetails: {
    // Encrypted payment info (never store raw card details)
    lastFourDigits: String,
    cardType: String,
    expiryMonth: String,
    expiryYear: String
  },
  description: String,
  notes: String,
  processedAt: Date,
  completedAt: Date,
  failedReason: String,
  refundedAt: Date,
  refundReason: String,
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
paymentRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Complete payment
paymentRequestSchema.methods.complete = function(transactionId) {
  this.status = 'completed';
  this.transactionId = transactionId;
  this.completedAt = Date.now();
  return this.save();
};

// Fail payment
paymentRequestSchema.methods.fail = function(reason) {
  this.status = 'failed';
  this.failedReason = reason;
  return this.save();
};

export default mongoose.model('PaymentRequest', paymentRequestSchema);
