require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Import express-fileupload
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // Import uploadRoutes
const couponRoutes = require('./routes/couponRoutes');
const connectDB = require('./config/db');
const Collection = require('./models/Collection');



const app = express();
const PORT = process.env.PORT;
connectDB();
app.use(cors({
  exposedHeaders: ['x-auth-token'],
}));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true })); // Enable file uploads

app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes); // Add uploadRoutes
app.use('/api/coupons', couponRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
