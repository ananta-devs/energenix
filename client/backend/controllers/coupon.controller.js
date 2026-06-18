const Coupon = require("../models/Coupon"); // Import Coupon model

module.exports = {
  // GET available coupons
  async getAvailableCoupons(req, res) {
    try {
      const currentDate = new Date();
      const coupons = await Coupon.find({
        is_active: true,
        visibility: "public", // Only show public coupons
        valid_from: { $lte: currentDate }, // Valid from date <= current date
        valid_until: { $gte: currentDate }, // Valid until date >= current date
      });

      // Filter out coupons that have reached their global usage limit
      const availableCoupons = coupons.filter(coupon => {
        // Check global usage limit
        if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
          return false;
        }

        // Check per-user usage limit if user is logged in OR phone is provided in query
        const userPhone = req.query.phone ? String(req.query.phone) : (req.user && req.user.phone ? String(req.user.phone) : null);
        const userEmail = req.query.email ? String(req.query.email) : (req.user && req.user.email ? String(req.user.email) : null);
        
        if (coupon.per_user_limit !== null) {
          if (userPhone) {
            const phoneUsageCount = coupon.used_phone_numbers.filter(
              (phone) => phone === userPhone
            ).length;
            if (phoneUsageCount >= coupon.per_user_limit) return false;
          }

          if (userEmail) {
            const emailUsageCount = coupon.used_emails.filter(
              (email) => email === userEmail
            ).length;
            if (emailUsageCount >= coupon.per_user_limit) return false;
          }
        }

        return true; // No usage limit or limit not reached
      });

      return res.json(availableCoupons);
    } catch (err) {
      console.error("Error fetching available coupons:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // Apply a coupon (for validation and discount calculation)
  async applyCoupon(req, res) {
    const { couponCode, cartTotal } = req.body;
    if (!couponCode || cartTotal === undefined) {
      return res.status(400).json({ message: "Coupon code and cart total are required." });
    }

    try {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found." });
      }

      // Basic validation checks
      const currentDate = new Date();
      if (!coupon.is_active) {
        return res.status(400).json({ message: "Coupon is not active." });
      }
      if (coupon.valid_from > currentDate) {
        return res.status(400).json({ message: "Coupon is not yet valid." });
      }
      if (coupon.valid_until < currentDate) {
        return res.status(400).json({ message: "Coupon has expired." });
      }
      if (coupon.minimum_purchase > cartTotal) {
        return res.status(400).json({
          message: `Minimum purchase of ₹${coupon.minimum_purchase} required.`,
        });
      }

      // Check global usage limit
      if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
        return res.status(400).json({ message: "Coupon has reached its maximum usage." });
      }

      // Per-user limit check (only if user is logged in, assuming auth middleware will provide req.user)
      // For now, let's assume req.user is available for authenticated requests for per-user checks
      // The frontend does not send user information to /coupons/apply, so this check will need adjustment
      // or should be done more robustly if anonymous usage is allowed.
      // For now, if per_user_limit exists, we won't allow anonymous apply for per_user_limit coupon.
      if (coupon.per_user_limit !== null) {
          // This part of validation is tricky if frontend doesn't send user info
          // and coupon should be applied to specific user.
          // For now, we'll implement a basic check that assumes the customer's phone number
          // is validated *during order creation*. The /apply endpoint is for showing potential discount.
          // This validation is more strict in order.controller.js's createOrder function.
          // We will NOT check per_user_limit here at this /apply endpoint.
          // The full per_user_limit check should be done in order.controller.js during final order placement.
          // This endpoint is primarily for displaying and calculating the discount.
      }


      return res.json({
        message: "Coupon applied successfully.",
        coupon: {
          _id: coupon._id,
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          description: coupon.description,
          minimum_purchase: coupon.minimum_purchase,
        },
      });
    } catch (err) {
      console.error("Error applying coupon:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};