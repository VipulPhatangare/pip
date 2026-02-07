// Inquiry Routes - Contact agent requests
import express from 'express';
import Inquiry from './models/Inquiry.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

/**
 * POST /api/inquiries - Create new inquiry
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const inquiryData = {
      ...req.body,
      user: req.user.id
    };

    const inquiry = await Inquiry.create(inquiryData);
    await inquiry.populate('property', 'title location price');
    await inquiry.populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      inquiry
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Failed to create inquiry', message: error.message });
  }
});

/**
 * GET /api/inquiries - Get user's inquiries
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const inquiries = await Inquiry.find(filter)
      .populate('property', 'title location price')
      .populate('replies.from', 'name role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      inquiries
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries', message: error.message });
  }
});

/**
 * GET /api/inquiries/:id - Get single inquiry with replies
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('property')
      .populate('user', 'name email phone')
      .populate('replies.from', 'name email role');

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    // Check if user owns this inquiry
    if (inquiry.user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this inquiry' });
    }

    // Mark as read if it's new
    if (inquiry.status === 'new') {
      inquiry.status = 'read';
      await inquiry.save();
    }

    res.json({
      success: true,
      inquiry
    });
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry', message: error.message });
  }
});

/**
 * POST /api/inquiries/:id/reply - Add reply to inquiry (agents/admins)
 */
router.post('/:id/reply', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    await inquiry.addReply(req.user.id, message);
    await inquiry.populate('replies.from', 'name email role');

    res.json({
      success: true,
      message: 'Reply added successfully',
      inquiry
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Failed to add reply', message: error.message });
  }
});

/**
 * PUT /api/inquiries/:id/status - Update inquiry status
 */
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'replied', 'resolved', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    inquiry.status = status;
    await inquiry.save();

    res.json({
      success: true,
      message: 'Status updated successfully',
      inquiry
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status', message: error.message });
  }
});

export default router;
