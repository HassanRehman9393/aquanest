const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    console.log('=== ORDER CREATION START ===');
    console.log('User ID:', req.user._id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      console.log('ERROR: No order items provided');
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    console.log('Order items to validate:', orderItems);

    // Validate ObjectIds before proceeding
    for (let item of orderItems) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        console.log('ERROR: Invalid product ID:', item.product);
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${item.product}`
        });
      }
    }

    console.log('All product IDs are valid ObjectIds');

    // Verify products exist and have sufficient stock
    for (let item of orderItems) {
      console.log('Checking product:', item.product);
      const product = await Product.findById(item.product);
      if (!product) {
        console.log('ERROR: Product not found:', item.product);
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }
      console.log('Product found:', product.name, 'Stock:', product.stock, 'Requested:', item.quantity);
      if (product.stock < item.quantity) {
        console.log('ERROR: Insufficient stock for:', product.name);
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
    }    console.log('All products verified, creating order...');

    const orderData = {
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    };

    console.log('Order data to save:', JSON.stringify(orderData, null, 2));
    console.log('Payment method received:', paymentMethod);
    console.log('Valid payment methods:', ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery']);

    const order = new Order(orderData);
    const createdOrder = await order.save();

    console.log('Order saved successfully with ID:', createdOrder._id);

    // Update product stock
    for (let item of orderItems) {
      console.log('Updating stock for product:', item.product, 'Reducing by:', item.quantity);
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    console.log('Stock updated successfully');
    console.log('=== ORDER CREATION SUCCESS ===');

    res.status(201).json({
      success: true,
      data: createdOrder
    });
  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    next(error);
  }
});

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res, next) => {
  try {
    console.log('=== FETCHING USER ORDERS ===');
    console.log('User ID:', req.user._id);
    
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name price images')
      .sort({ createdAt: -1 });

    console.log('Orders found for user:', orders.length);
    console.log('Order IDs:', orders.map(order => order._id));

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('=== FETCH ORDERS ERROR ===');
    console.error('Error details:', error);
    next(error);
  }
});

// @desc    Get order statistics for user
// @route   GET /api/orders/stats
// @access  Private
router.get('/stats', protect, async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments({ user: req.user._id });
    const totalSpent = await Order.aggregate([
      { $match: { user: req.user._id, isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
      emailAddress: req.body.payer?.email_address
    };

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res, next) => {
  try {
    console.log('=== ORDER STATUS UPDATE ===');
    console.log('Order ID:', req.params.id);
    console.log('New status:', req.body.status);
    console.log('User role:', req.user.role);
    
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      console.log('ERROR: Order not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('Current order status:', order.status);
    order.status = status;
    
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      console.log('Order marked as delivered');
    }

    const updatedOrder = await order.save();
    console.log('Order status updated successfully to:', updatedOrder.status);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Restore product stock
    for (let item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = 'cancelled';
    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
