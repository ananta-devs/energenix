require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Import express-fileupload
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // Import uploadRoutes
const connectDB = require('./config/db');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true })); // Enable file uploads

app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/upload', uploadRoutes); // Add uploadRoutes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
