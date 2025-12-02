
const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer');

exports.signup = async (req, res) => {
  const { fullName, email, phone } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      fullName,
      email,
      phone,
    });

    await user.save();

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    const newOTP = new OTP({ email, otp });
    await newOTP.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP for Registration',
      html: `<h1>Your OTP is ${otp}</h1>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });

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

    // OTP is valid, update user verification status
    let user = await User.findOne({ email });
    user.isVerified = true;
    await user.save();

    // Delete the OTP after successful verification, but only if it's not for forgot password
    // If it's for forgot password, the OTP will be deleted after password reset
    if (req.body.from !== 'forgot-password') {
      await OTP.deleteOne({ email, otp });
    }

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

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email with OTP first' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    const newOTP = new OTP({ email, otp });
    await newOTP.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP for Sign In',
      html: `<h1>Your OTP for sign in is ${otp}</h1>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });

    res.status(200).json({ msg: 'OTP sent to your email for sign in' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email not registered' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    const newOTP = new OTP({ email, otp });
    await newOTP.save();

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: `<h1>Your OTP for password reset is ${otp}</h1>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });

    res.status(200).json({ msg: 'OTP sent to your email for password reset' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  console.log('Reset Password Request:', { email, otp, newPassword });

  try {
    const storedOTP = await OTP.findOne({ email, otp });
    console.log('Stored OTP:', storedOTP);

    if (!storedOTP) {
      console.log('Invalid or expired OTP for email:', email);
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    let user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ msg: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    console.log('User password updated for email:', email);

    await OTP.deleteOne({ email, otp });
    console.log('OTP deleted for email:', email);

    res.status(200).json({ msg: 'Password reset successfully' });
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

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP for Email Update',
      html: `<h1>Your OTP for email update is ${otp}</h1>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });

    res.status(200).json({ msg: 'OTP sent to your new email for verification' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (user) {
      return res.status(400).json({ msg: 'Email already in use' });
    }
    res.status(200).json({ msg: 'Email is available' });
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
