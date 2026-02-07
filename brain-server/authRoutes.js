// Authentication Routes with JWT and MongoDB
import express from 'express';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

const router = express.Router();

// JWT Secret (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * Middleware to verify JWT token
 */
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * POST /api/auth/signup - Register new user
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // STATIC/DEMO SIGNUP - Always works without MongoDB
    console.log('✅ Static signup successful for:', email);
    
    const token = jwt.sign(
      { id: 'static-' + Date.now(), email: email.toLowerCase(), name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: 'static-' + Date.now(),
        name,
        email: email.toLowerCase(),
        phone: phone || '+1-555-0000',
        role: 'user',
        preferences: {
          alwaysOptimize: false,
          neverOptimize: false,
          preferredTier: null
        },
        createdAt: new Date().toISOString()
      }
    });

    /* MongoDB signup (commented out for demo mode)
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user (password will be hashed automatically by pre-save hook)
    const user = await User.create({
      name,
      email,
      phone: phone || '',
      password
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user without password
    const userWithoutPassword = user.getPublicProfile();

    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword
    });
    */
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * POST /api/auth/login - Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, hasPassword: !!password });

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // STATIC/DEMO LOGIN - Always works without MongoDB
    const staticUsers = {
      'demo@alphabyte.com': { password: 'demo123', name: 'Demo User', role: 'user' },
      'admin@alphabyte.com': { password: 'admin123', name: 'Admin User', role: 'admin' },
      'test@alphabyte.com': { password: 'test123', name: 'Test User', role: 'user' }
    };

    const staticUser = staticUsers[email.toLowerCase()];
    
    if (staticUser && staticUser.password === password) {
      console.log('✅ Static login successful for:', email);
      
      const token = jwt.sign(
        { id: 'static-' + Date.now(), email: email.toLowerCase(), name: staticUser.name },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: 'static-' + Date.now(),
          name: staticUser.name,
          email: email.toLowerCase(),
          phone: '+1-555-0000',
          role: staticUser.role,
          preferences: {
            alwaysOptimize: false,
            neverOptimize: false,
            preferredTier: null
          },
          createdAt: new Date().toISOString()
        }
      });
    }

    // Try MongoDB login if static login fails
    // Find user (include password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    console.log('User found:', !!user, user ? `ID: ${user._id}, Email: ${user.email}` : 'Not found');
    
    if (!user) {
      console.log('❌ Login failed: User not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User details:', {
      id: user._id,
      email: user.email,
      isActive: user.isActive,
      hasPassword: !!user.password,
      passwordLength: user.password ? user.password.length : 0
    });

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ Login failed: User account inactive');
      return res.status(403).json({ error: 'Account is deactivated. Please contact support.' });
    }

    // Verify password
    console.log('Comparing password...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Login failed: Invalid password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('✅ Login successful for:', user.email);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user without password
    const userWithoutPassword = user.getPublicProfile();

    res.json({
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * GET /api/auth/verify - Verify JWT token and get user
 */
router.get('/verify', verifyToken, async (req, res) => {
  try {
    // Find user from decoded token
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user without password
    const userWithoutPassword = user.getPublicProfile();

    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

/**
 * GET /api/auth/me - Get current user (protected)
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userWithoutPassword = user.getPublicProfile();
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

export default router;
