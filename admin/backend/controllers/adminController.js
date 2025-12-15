const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
  const { adm_email, password } = req.body;

  try {
    const admin = await Admin.findOne({ adm_email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (admin.status === 'disabled') {
        return res.status(401).json({ message: 'Your account is disabled.' });
    }

    const payload = {
      admin: {
        id: admin.id,
        isSuper: admin.isSuper,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ isSuper: false }).select('-password');
    res.json(admins);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const addAdmin = async (req, res) => {
  const { adm_name, adm_email, adm_phone, password } = req.body;

  try {
    let admin = await Admin.findOne({ adm_email });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    admin = new Admin({
      adm_name,
      adm_email,
      adm_phone,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();

    res.json(admin);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const updateAdminStatus = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.status = req.body.status;
    await admin.save();
    res.json(admin);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ message: 'Admin removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


module.exports = {
  loginAdmin,
  getAdmins,
  addAdmin,
  updateAdminStatus,
  deleteAdmin,
  changePassword,
};
