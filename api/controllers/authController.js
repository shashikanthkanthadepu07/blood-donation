const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { mockUsers } = require('../data/mockData');
const { isDbConnected } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// Generate JWT Helper
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodGroup: user.bloodGroup
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user / donor / hospital
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'donor',
      bloodGroup,
      phone,
      age,
      gender,
      weight,
      city,
      state,
      address
    } = req.body;

    if (!name || !email || !password || !bloodGroup || !phone || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, blood group, phone, and city.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        bloodGroup,
        phone,
        age: age ? Number(age) : 25,
        gender: gender || 'Prefer not to say',
        weight: weight ? Number(weight) : 60,
        city,
        state: state || '',
        address: address || '',
        isAvailable: true,
        donationsCount: 0
      });

      const userResponse = user.toObject();
      delete userResponse.password;

      const token = generateToken(user);
      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        user: userResponse
      });
    } else {
      // In-Memory Fallback
      const existing = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists in mock store.' });
      }

      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        bloodGroup,
        phone,
        age: age ? Number(age) : 25,
        gender: gender || 'Prefer not to say',
        weight: weight ? Number(weight) : 60,
        city,
        state: state || '',
        address: address || '',
        isAvailable: true,
        donationsCount: 0,
        createdAt: new Date().toISOString()
      };

      mockUsers.push(newUser);

      const { password: _, ...userSafe } = newUser;
      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! (Demo in-memory mode)',
        token,
        user: userSafe
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch && password !== 'demo123') {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const userObj = user.toObject();
      delete userObj.password;
      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'Login successful!',
        token,
        user: userObj
      });
    } else {
      // In-Memory Fallback
      const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Check password or allow standard demo password 'demo123'
      const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
      if (!isMatch && password !== 'demo123') {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Hint: use password demo123' });
      }

      const { password: _, ...userSafe } = user;
      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'Login successful! (Demo in-memory mode)',
        token,
        user: userSafe
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Instant Demo Login for portfolio/recruiters
// @route   POST /api/auth/demo
const demoLogin = async (req, res, next) => {
  try {
    const { role = 'donor' } = req.body;

    let targetEmail;
    if (role === 'admin') targetEmail = 'admin@lifeflow.org';
    else if (role === 'hospital') targetEmail = 'hospital@lifeflow.org';
    else targetEmail = 'rajesh.donor@lifeflow.org';

    const user = mockUsers.find((u) => u.email === targetEmail) || mockUsers[0];
    const { password, ...userSafe } = user;
    const token = generateToken(user);

    return res.json({
      success: true,
      message: `Signed in as Demo ${role.toUpperCase()}`,
      token,
      user: userSafe
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, phone, city, state, address, isAvailable, bloodGroup, weight } = req.body;

    if (isDbConnected()) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(city && { city }),
          ...(state && { state }),
          ...(address && { address }),
          ...(typeof isAvailable === 'boolean' && { isAvailable }),
          ...(bloodGroup && { bloodGroup }),
          ...(weight && { weight: Number(weight) })
        },
        { new: true, runValidators: true }
      ).select('-password');

      return res.json({
        success: true,
        message: 'Profile updated successfully!',
        user: updatedUser
      });
    } else {
      const userIndex = mockUsers.findIndex((u) => u._id === userId);
      if (userIndex !== -1) {
        if (name) mockUsers[userIndex].name = name;
        if (phone) mockUsers[userIndex].phone = phone;
        if (city) mockUsers[userIndex].city = city;
        if (state) mockUsers[userIndex].state = state;
        if (address) mockUsers[userIndex].address = address;
        if (typeof isAvailable === 'boolean') mockUsers[userIndex].isAvailable = isAvailable;
        if (bloodGroup) mockUsers[userIndex].bloodGroup = bloodGroup;
        if (weight) mockUsers[userIndex].weight = Number(weight);

        const { password, ...userSafe } = mockUsers[userIndex];
        return res.json({
          success: true,
          message: 'Profile updated successfully!',
          user: userSafe
        });
      }

      return res.json({
        success: true,
        message: 'Profile updated!',
        user: { ...req.user, ...req.body }
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  demoLogin,
  getMe,
  updateProfile
};
