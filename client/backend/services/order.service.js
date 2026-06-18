const Order = require("../models/Order");
const Product = require("../models/Product");
const TempOrder = require("../models/TempOrder");

module.exports = {

  /**
   * Find all orders by email
   */
  async findAll(email) {
    // 1. Fetch Real Orders
    const orders = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 }).lean();

    // 2. Fetch Pending Temp Orders (Using userId as requested)
    const tempOrders = await TempOrder.find({ 
      userId: email,
      status: { $in: ["PENDING_PAYMENT", "PAYMENT_SUCCESS"] } 
    }).sort({ createdAt: -1 }).lean();

    // 3. Enrich Real Orders
    for (const order of orders) {
      for (const item of order.items) {
        const product = await Product.findById(item.sku_number).lean();
        if (product && product.image_urls) {
          item.image_urls = product.image_urls;
        }
      }
    }

    // 4. Enrich & Format Temp Orders
    const formattedTempOrders = [];
    for (const tOrder of tempOrders) {
      // Basic enrichment for items
      for (const item of tOrder.items) {
          // If items in TempOrder don't have images (they should based on creation logic, but double check)
          if (!item.image_urls || item.image_urls.length === 0) {
             const product = await Product.findById(item.sku_number).lean();
             if (product && product.image_urls) {
               item.image_urls = product.image_urls;
             }
          }
      }

      // Map to Order interface
      formattedTempOrders.push({
          ...tOrder,
          _id: tOrder._id, // Keep temp ID
          status: "PAYMENT_PROCESSING", // Visual status for frontend
          is_temp: true // Flag for frontend if needed
      });
    }

    // 5. Combine and Sort
    const combined = [...formattedTempOrders, ...orders];
    combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return combined;
  },

  /**
   * Create a new order
   */
  async create(data) {
    return await Order.create(data);
  },

  /**
   * Find by order_id
   */
  async findByOrderId(orderId) {
    return await Order.findOne({ order_id: orderId });
  },

  /**
   * Update order fields
   */
  async update(orderId, updates) {
    return await Order.findOneAndUpdate(
      { order_id: orderId },
      { $set: updates },
      { new: true }
    );
  },

  /**
   * Update tracking
   */
  async updateTracking(orderId, trackingResponse) {
    const data = trackingResponse?.data || {};
    
    // Extract status from top-level current_status (preferred) or fallback to last event
    let status = data.current_status;
    
    // Handle scan details (prompt says scan_detail, some docs say track_data)
    const scans = data.scan_detail || data.track_data || [];
    const lastEvent = scans.length ? scans[scans.length - 1] : {};

    if (!status) {
        status = lastEvent.status || "UNKNOWN";
    }

    return await Order.findOneAndUpdate(
      { order_id: orderId },
      {
        $set: {
          shipmozo_tracking_response: trackingResponse,
          status: status,
          last_tracking_event: {
            status: lastEvent.status || status || "",
            location: lastEvent.location || "",
            date: lastEvent.date || data.status_time || "",
            remark: lastEvent.remark || ""
          }
        }
      },
      { new: true }
    );
  },

  /**
   * Cancel order
   */
  async cancel(orderId) {
    return await Order.findOneAndUpdate(
      { order_id: orderId },
      {
        $set: {
          cancelled: true,
          cancelled_at: new Date(),
          status: "reqForCancel"
        }
      },
      { new: true }
    );
  }
};
