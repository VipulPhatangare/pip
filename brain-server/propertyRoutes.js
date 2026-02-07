// Property Routes - CRUD operations for real estate listings
import express from 'express';
import Property from './models/Property.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

/**
 * GET /api/properties - Get all properties with filtering and pagination
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      status = 'available',
      minPrice,
      maxPrice,
      city,
      bedrooms,
      bathrooms,
      featured
    } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (bedrooms) filter['features.bedrooms'] = { $gte: parseInt(bedrooms) };
    if (bathrooms) filter['features.bathrooms'] = { $gte: parseInt(bathrooms) };
    if (featured !== undefined) filter.featured = featured === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Get properties with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const properties = await Property.find(filter)
      .populate('agent', 'name email phone')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ featured: -1, createdAt: -1 });

    // Get total count for pagination
    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties', message: error.message });
  }
});

/**
 * GET /api/properties/:id - Get single property by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'name email phone role');

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment views
    await property.incrementViews();

    res.json({
      success: true,
      property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property', message: error.message  });
  }
});

/**
 * POST /api/properties - Create new property (agents/admins only)
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    // Set agent to current user
    const propertyData = {
      ...req.body,
      agent: req.user.id
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property', message: error.message });
  }
});

/**
 * PUT /api/properties/:id - Update property (agents/admins only)
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Check if user is the agent of this property or admin
    if (property.agent.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this property' });
    }

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('agent', 'name email phone');

    res.json({
      success: true,
      message: 'Property updated successfully',
      property: updatedProperty
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property', message: error.message });
  }
});

/**
 * DELETE /api/properties/:id - Delete property (admins only)
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property', message: error.message });
  }
});

export default router;
