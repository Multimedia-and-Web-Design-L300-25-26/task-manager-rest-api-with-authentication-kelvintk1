import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
        userId: user._id 
    }, 
    process.env.JWT_SECRET, 
    { 
        expiresIn: '90d' 
    }
  );
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;  // Use 'username' not 'name'

    // Validate input
    if (!username || !email || !password) {  // Check username
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already registered' 
      });
    }

    // Save user
    const user = await User.create({
      username,  // Use username field
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public 
export const login = async (req, res) => {
    const { email, password } = req.body;
    // check if all fields are provided
    if (!email || !password) {
        return res.status(400).json(
            { 
                message: 'Please provide email and password' 
            }
        );
    }

    try {
        // check if user exists and compare the password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json(
                { 
                    message: 'Invalid credentials' 
                }
            );
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json(
                { 
                    message: 'Invalid credentials' 
                }
            );
        }
        res.status(200).json(
            { 
                message: 'User logged in successfully',
                data: {
                    user,
                    token: generateToken(user._id)
                }
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json(
            { 
                message: 'Error logging in user',
                error: error.message
            }
        );
    }
};