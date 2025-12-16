// controllers/shipmozoController.js

const getShipmozoConfig = (req, res) => {
  try {
    const publicKey = process.env.SHIPMOZO_PUBLIC_KEY;
    const privateKey = process.env.SHIPMOZO_PRIVATE_KEY;
    const baseUrl = process.env.SHIPMOZO_BASE_URL;

    if (!publicKey || !privateKey || !baseUrl) {
      console.error('Shipmozo environment variables not set in backend/.env file.');
      return res.status(500).json({ message: 'Shipping integration is not configured correctly.' });
    }

    res.json({
      publicKey,
      privateKey,
      baseUrl,
    });
  } catch (error) {
    console.error('Error fetching Shipmozo config:', error);
    res.status(500).json({ message: 'Server error while fetching shipping configuration.' });
  }
};

module.exports = {
  getShipmozoConfig,
};