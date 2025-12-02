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
const connectDB = require('./config/db');
const Collection = require('./models/Collection');

connectDB().then(async () => {
  try {
    await Collection.collection.dropIndex('hsn_number_1');
    console.log('Successfully dropped the unique index on hsn_number.');
  } catch (error) {
    if (error.code === 27) { // Index not found
      console.log('Index hsn_number_1 not found, it might have been already removed.');
    }
    else {
      console.error('Error dropping index:', error);
    }
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
