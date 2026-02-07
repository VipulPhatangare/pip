// Property Model - Real Estate Listings
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['house', 'apartment', 'villa', 'condo', 'land', 'commercial'],
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'sold', 'rented'],
    default: 'available'
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  features: {
    bedrooms: Number,
    bathrooms: Number,
    area: Number, // in sq ft
    areaUnit: {
      type: String,
      default: 'sqft'
    },
    parking: Number,
    yearBuilt: Number,
    amenities: [String]
  },
  images: [{
    url: String,
    thumbnail: String,
    alt: String
  }],
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
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
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Increment views
propertySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

export default mongoose.model('Property', propertySchema);
