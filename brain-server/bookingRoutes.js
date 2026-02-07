// Booking Routes - Property visit appointments
import express from 'express';
import Booking from './models/Booking.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

/**
 * POST /api/bookings - Create new booking
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      user: req.user.id
    };

    const booking = await Booking.create(bookingData);
    await booking.populate('property', 'title location price');
    await booking.populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking', message: error.message });
  }
});

/**
 * GET /api/bookings - Get user's bookings
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('property', 'title location price images')
      .sort({ visitDate: 1, createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings', message: error.message });
  }
});

/**
 * GET /api/bookings/:id - Get single booking
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking', message: error.message });
  }
});

/**
 * PUT /api/bookings/:id/confirm - Confirm booking (agents only)
 */
router.put('/:id/confirm', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.confirm();

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ error: 'Failed to confirm booking', message: error.message });
  }
});

/**
 * PUT /api/bookings/:id/cancel - Cancel booking
 */
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    await booking.cancel(reason || 'Cancelled by user');

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking', message: error.message });
  }
});

export default router;
