
const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

exports.signup = async (req, res) => {
  const { fullName, email, phone } = req.body;

  try {
    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    let userByPhone = await User.findOne({ phone });
    if (userByPhone) {
      return res.status(400).json({ msg: 'Phone number already exists' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database along with user details
    const newOTP = new OTP({ email, otp, fullName, phone });
    await newOTP.save();

    // Send OTP via email using service
    try {
      await emailService.sendAuthOtp(email, otp, 'signup');
    } catch (error) {
      console.error('Email send error:', error);
      return res.status(500).send('Failed to send OTP email');
    }

    res.status(200).json({ msg: 'OTP sent to your email for verification' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOTP = await OTP.findOne({ email, otp });

    if (!storedOTP) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // OTP is valid, retrieve user details from stored OTP
    const { fullName, phone } = storedOTP;

    // Create new user (since user is not created at signup anymore)
    let user = new User({
      fullName,
      email,
      phone,
    });

    await user.save();

    // Delete the OTP after successful verification
    await OTP.deleteOne({ email, otp });

    const payload = {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.verifySigninOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const storedOTP = await OTP.findOne({ email, otp });

    if (!storedOTP) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // OTP is valid, find user
    let user = await User.findOne({ email });

    // Delete the OTP after successful verification
    await OTP.deleteOne({ email, otp });

    const payload = {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.signin = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'User with this email does not exist' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    const newOTP = new OTP({ email, otp });
    await newOTP.save();

    // Send OTP via email using service
    try {
      await emailService.sendAuthOtp(email, otp, 'signin');
    } catch (error) {
      console.error('Email send error:', error);
      return res.status(500).send('Failed to send OTP email');
    }

    res.status(200).json({ msg: 'OTP sent to your email for sign in' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.resendOtp = async (req, res) => {
  const { email, type } = req.body;

  try {
    const existingOtp = await OTP.findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingOtp) {
      existingOtp.otp = otp;
      existingOtp.createdAt = Date.now();
      await existingOtp.save();
    } else {
      // If it's a signup and record is gone (expired), they should probably re-fill the form, 
      // but we can try to send it if we have the email.
      const newOTP = new OTP({ email, otp });
      await newOTP.save();
    }

    await emailService.sendAuthOtp(email, otp, 'resend');

    res.status(200).json({ msg: 'OTP resent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateMe = async (req, res) => {
  const { fullName, phone } = req.body;

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.sendUpdateEmailOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    const newOTP = new OTP({ email, otp });
    await newOTP.save();

    // Send OTP via email using service
    try {
      await emailService.sendAuthOtp(email, otp, 'update');
    } catch (error) {
      console.error('Email send error:', error);
      return res.status(500).send('Failed to send OTP email');
    }

    res.status(200).json({ msg: 'OTP sent to your new email for verification' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ exists: true, msg: 'Email exists' });
    } else {
      return res.status(400).json({ exists: false, msg: 'Email does not exist' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.verifyUpdateEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    const storedOTP = await OTP.findOne({ email, otp });

    if (!storedOTP) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.email = email;
    await user.save();

    await OTP.deleteOne({ email, otp });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
