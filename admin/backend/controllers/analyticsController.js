const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Collection = require('../models/Collection'); // Corrected import for Collection
const mongoose = require('mongoose'); // Import mongoose for ObjectId
const asyncHandler = require('express-async-handler');

// Helper to get start and end of months
const getMonthBounds = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

// Function to generate a consistent color for categories
const categoryColors = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57', '#ffc0cb', '#800080'
];

const getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      return {
        name: d.toLocaleString('en-US', { month: 'short' }),
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999),
      };
    }).reverse(); // To get months in chronological order

    // Monthly Sales Aggregation
    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: months[0].start, $lte: months[months.length - 1].end },
          status: { $nin: ['cancelled', 'pending'] } // Consider only completed or shipped orders
        }
      },
      { $unwind: '$items' }, // Unwind the items array
      {
        $addFields: {
          itemTotal: { $multiply: ['$items.quantity', '$items.unit_price'] } // Calculate item total
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalRevenue: { $sum: '$itemTotal' }, // Sum calculated item totals
                            totalOrders: { $addToSet: '$_id' }, // Count unique orders
                            uniqueCustomers: { $addToSet: '$customer.email' } // Assuming 'customer.email' for unique customers
                          }
                        },      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalRevenue: 1,
          totalOrders: { $size: '$totalOrders' },
          uniqueCustomers: { $size: '$uniqueCustomers' }
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    const formattedMonthlySales = months.map(m => {
      const salesData = monthlySales.find(
        ms => ms.month === m.start.getMonth() + 1 && ms.year === m.start.getFullYear()
      );
      return {
        month: m.name,
        sales: salesData ? salesData.totalRevenue : 0,
        revenue: salesData ? salesData.totalRevenue : 0, // Using revenue for totalAmount
        orders: salesData ? salesData.totalOrders : 0,
        customers: salesData ? salesData.uniqueCustomers : 0,
      };
    });

    // Category Revenue Aggregation - Workaround
    const categoryRevenuePipeline = [
      {
        $match: {
          status: { $nin: ['cancelled', 'pending'] }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'collections', // The name of the collections collection
          localField: 'items.product_category', // Use product_category from order item
          foreignField: 'product_category', // Match with product_category in collection
          as: 'collectionDetails'
        }
      },
      { $unwind: '$collectionDetails' }, // Unwind if a match is found
      {
        $group: {
          _id: '$collectionDetails.title', // Group by collection title for display
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.unit_price'] } }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          revenue: '$totalRevenue'
        }
      }
    ];

    const categoryRevenue = await Order.aggregate(categoryRevenuePipeline);

    const formattedCategoryRevenue = categoryRevenue.map((item, index) => ({
      ...item,
      color: categoryColors[index % categoryColors.length], // Assign a color
    }));


    const analyticsData = {
      monthlySales: formattedMonthlySales,
      categoryRevenue: formattedCategoryRevenue,
    };
    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const today = new Date();
    const currentMonthBounds = getMonthBounds(today);
    const lastMonthBounds = getMonthBounds(new Date(today.getFullYear(), today.getMonth() - 1, 1));

    // Sales Summary
    const salesSummaryData = await Order.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled', 'pending'] }
        }
      },
      { $unwind: '$items' }, // Unwind the items array
      {
        $addFields: {
          itemTotal: { $multiply: ['$items.quantity', '$items.unit_price'] } // Calculate item total
        }
      },
      {
        $group: {
          _id: '$_id', // Group by order ID first to sum item totals per order
          orderTotal: { $sum: '$itemTotal' },
                        customerEmail: { $first: '$customer.email' } // Keep customer email for later unique customer count
                      }
                    },
                    {
                      $group: {
                        _id: null,
                        totalRevenue: { $sum: '$orderTotal' }, // Sum up all order totals
                        totalOrders: { $sum: 1 }, // Count total unique orders
                        uniqueCustomers: { $addToSet: '$customerEmail' } // Count unique customers by email
                      }
                    },      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          totalUniqueCustomers: { $size: '$uniqueCustomers' }
        }
      }
    ]);

    const currentMonthSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: currentMonthBounds.start, $lte: currentMonthBounds.end },
          status: { $nin: ['cancelled', 'pending'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$_id',
          orderTotal: { $sum: { $multiply: ['$items.quantity', '$items.unit_price'] } }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$orderTotal' }
        }
      }
    ]);

    const lastMonthSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonthBounds.start, $lte: lastMonthBounds.end },
          status: { $nin: ['cancelled', 'pending'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$_id',
          orderTotal: { $sum: { $multiply: ['$items.quantity', '$items.unit_price'] } }
        }
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$orderTotal' }
        }
      }
    ]);

    const totalRevenue = salesSummaryData[0]?.totalRevenue || 0;
    const totalOrders = salesSummaryData[0]?.totalOrders || 0;
    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    const currentMonthRevenue = currentMonthSales[0]?.revenue || 0;
    const lastMonthRevenue = lastMonthSales[0]?.revenue || 0;
    const monthOverMonthGrowth = lastMonthRevenue > 0
      ? (((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
      : (currentMonthRevenue > 0 ? 100 : 0); // If last month was 0, and current is > 0, 100% growth


    // Inventory Health
    const totalProducts = await Product.countDocuments();
    const lowStockThreshold = 10; // Define your low stock threshold
    const lowStockItems = await Product.countDocuments({ stock: { $gt: 0, $lt: lowStockThreshold } });
    const outOfStockItems = await Product.countDocuments({ stock: 0 });

    // Customer Insights
    const totalCustomers = await User.countDocuments();
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()); // Corrected variable name
    const newCustomers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    const repeatCustomers = await Order.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled', 'pending'] }
        }
      },
          {
            $group: {
              _id: '$customer.email', // Group by customer email to find repeat customers
              orderCount: { $sum: 1 }
            }
          },
      {
        $match: {
          orderCount: { $gt: 1 }
        }
      },
      {
        $count: 'repeatCustomerCount'
      }
    ]);

    const customerInsightsTotalCustomers = salesSummaryData[0]?.totalUniqueCustomers || 0;
    const repeatCustomerCount = repeatCustomers[0]?.repeatCustomerCount || 0;
    const customerRetentionRate = customerInsightsTotalCustomers > 0
      ? ((repeatCustomerCount / customerInsightsTotalCustomers) * 100).toFixed(1)
      : 0;

    const reportsData = {
      salesSummary: {
        totalRevenue: totalRevenue,
        monthOverMonthGrowth: parseFloat(monthOverMonthGrowth),
        totalOrders: totalOrders,
        averageOrderValue: parseFloat(averageOrderValue),
        conversionRate: 0 // This needs more sophisticated tracking, defaulting to 0 for now
      },
      inventoryHealth: {
        totalProducts: totalProducts,
        lowStockItems: lowStockItems,
        outOfStockItems: outOfStockItems,
        stockTurnoverRate: 0 // This needs more sophisticated tracking, defaulting to 0 for now
      },
      customerInsights: {
        totalCustomers: totalCustomers,
        newCustomers: newCustomers,
        repeatCustomers: repeatCustomerCount,
        customerRetentionRate: parseFloat(customerRetentionRate)
      },
    };

    res.status(200).json(reportsData);
  } catch (error) {
    console.error('Error fetching reports data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTopSellingProducts = asyncHandler(async (req, res) => {
  const topProducts = await Order.aggregate([
    { $match: { status: { $nin: ['cancelled', 'pending'] } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.sku_number',
        name: { $first: '$items.name' },
        totalQuantitySold: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.unit_price'] } }
      }
    },
    { $sort: { totalQuantitySold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'sku',
        as: 'productDetails'
      }
    },
    { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 0,
        sku: '$_id',
        name: 1,
        totalQuantitySold: 1,
        totalRevenue: 1,
        image: { $arrayElemAt: ['$productDetails.image_urls', 0] }
      }
    }
  ]);
  res.json(topProducts);
});

const getRecentActivity = asyncHandler(async (req, res) => {
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
  const recentCustomers = await User.find().sort({ createdAt: -1 }).limit(5);

  const ordersActivity = recentOrders.map(order => ({
    type: 'new_order',
    data: {
      name: order.customer.name,
      orderId: order.order_id,
      total: order.items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0)
    },
    timestamp: order.createdAt
  }));

  const customersActivity = recentCustomers.map(user => ({
    type: 'new_customer',
    data: {
      name: user.fullname,
      email: user.email,
    },
    timestamp: user.createdAt
  }));

  const combinedActivity = [...ordersActivity, ...customersActivity];
  combinedActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json(combinedActivity.slice(0, 10));
});


module.exports = {
  getAnalytics,
  getReports,
  getTopSellingProducts,
  getRecentActivity,
};