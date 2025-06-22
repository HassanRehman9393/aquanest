const path = require('path');
const dotenv = require('dotenv');

// Load environment variables with explicit path
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  console.log('Setting default environment variables...');
  // Set default values if .env file fails to load
  process.env.PORT = process.env.PORT || '5000';
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aquanest';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'aquanest-super-secret-jwt-key-for-development-2025';
  process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
}

// If parsed variables are empty, set defaults
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'undefined') {
  process.env.PORT = '5000';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/aquanest';
  process.env.JWT_SECRET = 'aquanest-super-secret-jwt-key-for-development-2025';
  process.env.JWT_EXPIRE = '7d';
  process.env.NODE_ENV = 'development';
  process.env.FRONTEND_URL = 'http://localhost:3000';
}

var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// Import database connection
const connectDB = require('./config/database');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var authRouter = require('./routes/auth');
var ordersRouter = require('./routes/orders');
var adminRouter = require('./routes/admin');

var app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://aquanest-ochre.vercel.app',
      'http://localhost:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AquaNest API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app;
