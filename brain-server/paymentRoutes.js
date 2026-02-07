// Payment Routes - Payment request handling
import express from 'express';
import PaymentRequest from './models/PaymentRequest.js';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

/**
 * POST /api/payments - Create new payment request
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const paymentData = {
      ...req.body,
      user: req.user.id,
      status: 'pending'
    };

    const payment = await PaymentRequest.create(paymentData);
    await payment.populate('property', 'title location price');
    await payment.populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Payment request created successfully',
      payment
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment request', message: error.message });
  }
});

/**
 * GET /api/payments - Get user's payment requests
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const payments = await PaymentRequest.find(filter)
      .populate('property', 'title location price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments', message: error.message });
  }
});

/**
 * GET /api/payments/:id - Get single payment request
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const payment = await PaymentRequest.findById(req.params.id)
      .populate('property')
      .populate('user', 'name email phone');

    if (!payment) {
      return res.status(404).json({ error: 'Payment request not found' });
    }

    // Check if user owns this payment
    if (payment.user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this payment' });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment', message: error.message });
  }
});

/**
 * PUT /api/payments/:id/complete - Mark payment as completed
 * (In production, this would be called by payment gateway webhook)
 */
router.put('/:id/complete', verifyToken, async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const payment = await PaymentRequest.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment request not found' });
    }

    await payment.complete(transactionId);

    res.json({
      success: true,
      message: 'Payment completed successfully',
      payment
    });
  } catch (error) {
    console.error('Error completing payment:', error);
    res.status(500).json({ error: 'Failed to complete payment', message: error.message });
  }
});

/**
 * PUT /api/payments/:id/fail - Mark payment as failed
 */
router.put('/:id/fail', verifyToken, async (req, res) => {
  try {
    const { reason } = req.body;

    const payment = await PaymentRequest.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment request not found' });
    }

    await payment.fail(reason || 'Payment processing failed');

    res.json({
      success: true,
      message: 'Payment marked as failed',
      payment
    });
  } catch (error) {
    console.error('Error failing payment:', error);
    res.status(500).json({ error: 'Failed to update payment', message: error.message });
  }
});

export default router;
