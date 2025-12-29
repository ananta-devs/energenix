const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const mongoose = require('mongoose');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'collections',
          localField: 'p_category',
          foreignField: '_id',
          as: 'p_category'
        }
      },
      {
        $unwind: {
          path: '$p_category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'inventories',
          localField: '_id',
          foreignField: 'product_id',
          as: 'inventory'
        }
      },
      {
        $unwind: {
          path: '$inventory',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          current_stock: { $ifNull: ['$inventory.current_stock', 0] }
        }
      },
      {
        $project: {
          inventory: 0
        }
      }
    ]);
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid Product ID' });
    }

    const product = await Product.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(productId) }
      },
      {
        $lookup: {
          from: 'collections',
          localField: 'p_category',
          foreignField: '_id',
          as: 'p_category'
        }
      },
      {
        $unwind: {
          path: '$p_category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'inventories',
          localField: '_id',
          foreignField: 'product_id',
          as: 'inventory'
        }
      },
      {
        $unwind: {
          path: '$inventory',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          current_stock: { $ifNull: ['$inventory.current_stock', 0] }
        }
      },
      {
        $project: {
          inventory: 0
        }
      }
    ]);

    if (!product || product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const products = await Product.aggregate([
      {
        $match: { p_name: { $regex: query, $options: 'i' } }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'inventories',
          localField: '_id',
          foreignField: 'product_id',
          as: 'inventory'
        }
      },
      {
        $unwind: {
          path: '$inventory',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          current_stock: { $ifNull: ['$inventory.current_stock', 0] }
        }
      },
      {
        $project: {
          p_name: 1,
          image_urls: 1,
          p_price: 1,
          discount_price: 1,
          current_stock: 1
        }
      }
    ]);

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.validateStock = async (req, res) => {
  try {
    const { items } = req.body; // Expecting array of { _id, quantity }
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid items format' });
    }

    const productIds = items.map(item => new mongoose.Types.ObjectId(item._id));
    
    // Fetch products with inventory info
    const products = await Product.aggregate([
      {
        $match: { _id: { $in: productIds } }
      },
      {
        $lookup: {
          from: 'inventories',
          localField: '_id',
          foreignField: 'product_id',
          as: 'inventory'
        }
      },
      {
        $unwind: {
          path: '$inventory',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          current_stock: { $ifNull: ['$inventory.current_stock', 0] }
        }
      },
      {
         $project: {
            _id: 1,
            p_name: 1,
            current_stock: 1
         }
      }
    ]);

    const outOfStockItems = [];

    // Check stock for each requested item
    items.forEach(requestedItem => {
        const product = products.find(p => p._id.toString() === requestedItem._id);
        if (product) {
            // Check if stock is sufficient for requested quantity (or just > 0 if you want to allow buying available stock)
            // User requirement: "if the product gets out of stock... user should be continued with the out of stock product" (interpreted as NOT continued)
            // We check strict availability here.
            if (product.current_stock < requestedItem.quantity || product.current_stock === 0) {
                 outOfStockItems.push({
                     _id: product._id,
                     name: product.p_name,
                     requested: requestedItem.quantity,
                     available: product.current_stock
                 });
            }
        } else {
             outOfStockItems.push({
                 _id: requestedItem._id,
                 name: 'Unknown Product',
                 available: 0,
                 error: 'Product not found'
             });
        }
    });

    res.status(200).json({ 
        valid: outOfStockItems.length === 0,
        outOfStockItems 
    });

  } catch (error) {
    console.error('Stock validation error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

