# 📚 AquaNest API Documentation

<div align="center">
  <h2>🌊 AquaNest Water Delivery API</h2>
  <p>Complete REST API documentation for the AquaNest platform</p>
  
  [![Express.js](https://img.shields.io/badge/Express.js-4.18-green?style=for-the-badge&logo=express)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)
</div>

## 🔗 Base URL

```
Production:  https://your-railway-app.railway.app/api
Development: http://localhost:5000/api
```

## 🔐 Authentication

The AquaNest API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Getting a Token
1. Register a new account or login
2. The API will return a JWT token
3. Include this token in subsequent requests

---

## 📝 API Endpoints

## 🔐 Authentication Routes

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b1b3b3f7b1b3b3f7b1b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b1b3b3f7b1b3b3f7b1b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Get Current User
```http
GET /api/auth/me
```
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "60f7b1b3b3f7b1b3b3f7b1b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "zipCode": "10001"
    },
    "createdAt": "2023-06-22T10:30:00.000Z"
  }
}
```

---

## 🧪 Products Routes

### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (optional): Filter by category (bottle, gallon, dispenser)
- `sort` (optional): Sort by price (asc, desc)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:**
```http
GET /api/products?category=bottle&sort=asc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "60f7b1b3b3f7b1b3b3f7b1b3",
      "name": "Premium Spring Water - 500ml",
      "description": "Pure spring water sourced from natural springs",
      "price": 1.99,
      "category": "bottle",
      "size": "500ml",
      "image": "https://res.cloudinary.com/...",
      "stock": 100,
      "isActive": true,
      "createdAt": "2023-06-22T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Single Product
```http
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b1b3b3f7b1b3b3f7b1b3",
    "name": "Premium Spring Water - 500ml",
    "description": "Pure spring water sourced from natural springs",
    "price": 1.99,
    "category": "bottle",
    "size": "500ml",
    "image": "https://res.cloudinary.com/...",
    "stock": 100,
    "isActive": true,
    "createdAt": "2023-06-22T10:30:00.000Z"
  }
}
```

### Create Product
```http
POST /api/products
```
*Requires Admin Authentication*

**Request Body:**
```json
{
  "name": "Premium Spring Water - 500ml",
  "description": "Pure spring water sourced from natural springs",
  "price": 1.99,
  "category": "bottle",
  "size": "500ml",
  "stock": 100,
  "image": "base64-encoded-image-or-url"
}
```

### Update Product
```http
PUT /api/products/:id
```
*Requires Admin Authentication*

### Delete Product
```http
DELETE /api/products/:id
```
*Requires Admin Authentication*

---

## 📦 Orders Routes

### Get User Orders
```http
GET /api/orders
```
*Requires Authentication*

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "60f7b1b3b3f7b1b3b3f7b1b3",
      "userId": "60f7b1b3b3f7b1b3b3f7b1b2",
      "items": [
        {
          "productId": "60f7b1b3b3f7b1b3b3f7b1b1",
          "product": {
            "name": "Premium Spring Water - 500ml",
            "image": "https://res.cloudinary.com/..."
          },
          "quantity": 6,
          "price": 1.99
        }
      ],
      "totalAmount": 11.94,
      "status": "pending",
      "deliveryAddress": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001"
      },
      "orderDate": "2023-06-22T10:30:00.000Z",
      "deliveryDate": "2023-06-23T14:00:00.000Z"
    }
  ]
}
```

### Get Single Order
```http
GET /api/orders/:id
```
*Requires Authentication*

### Create Order
```http
POST /api/orders
```
*Requires Authentication*

**Request Body:**
```json
{
  "items": [
    {
      "productId": "60f7b1b3b3f7b1b3b3f7b1b1",
      "quantity": 6,
      "price": 1.99
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}
```

### Update Order Status
```http
PATCH /api/orders/:id/status
```
*Requires Admin Authentication*

**Request Body:**
```json
{
  "status": "shipped"
}
```

---

## 👥 Users Routes (Admin Only)

### Get All Users
```http
GET /api/users
```
*Requires Admin Authentication*

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "60f7b1b3b3f7b1b3b3f7b1b3",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "createdAt": "2023-06-22T10:30:00.000Z",
      "ordersCount": 5,
      "totalSpent": 59.70
    }
  ]
}
```

### Get User by ID
```http
GET /api/users/:id
```
*Requires Admin Authentication*

### Update User Role
```http
PATCH /api/users/:id/role
```
*Requires Admin Authentication*

**Request Body:**
```json
{
  "role": "admin"
}
```

---

## 📊 Analytics Routes (Admin Only)

### Get Dashboard Stats
```http
GET /api/analytics/dashboard
```
*Requires Admin Authentication*

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "totalRevenue": 2985.50,
    "totalCustomers": 45,
    "totalProducts": 25,
    "recentOrders": [
      {
        "id": "60f7b1b3b3f7b1b3b3f7b1b3",
        "customerName": "John Doe",
        "totalAmount": 11.94,
        "status": "pending",
        "orderDate": "2023-06-22T10:30:00.000Z"
      }
    ],
    "topProducts": [
      {
        "product": "Premium Spring Water - 500ml",
        "sales": 85,
        "revenue": 169.15
      }
    ]
  }
}
```

### Get Sales Analytics
```http
GET /api/analytics/sales
```
*Requires Admin Authentication*

**Query Parameters:**
- `period` (optional): time period (week, month, year)
- `startDate` (optional): start date (YYYY-MM-DD)
- `endDate` (optional): end date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": 2985.50,
    "salesByDay": [
      {
        "date": "2023-06-22",
        "sales": 245.80,
        "orders": 12
      }
    ],
    "salesByCategory": [
      {
        "category": "bottle",
        "sales": 1892.40,
        "percentage": 63.4
      }
    ]
  }
}
```

---

## 🔧 Utility Routes

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2023-06-22T10:30:00.000Z",
  "uptime": 3600,
  "database": "connected"
}
```

### Upload Image
```http
POST /api/upload
```
*Requires Authentication*

**Request:** Multipart form data with image file

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/..."
}
```

---

## ❌ Error Responses

All API endpoints return consistent error responses:

### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Email is required",
  "details": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid token"
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Admin access required"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Product not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

---

## 📝 Data Models

### User Model
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  role: 'customer' | 'admin';
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  createdAt: Date;
}
```

### Product Model
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'bottle' | 'gallon' | 'dispenser';
  size: string;
  image: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
}
```

### Order Model
```typescript
interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
  };
  orderDate: Date;
  deliveryDate?: Date;
}
```

---

## 🧪 Testing the API

### Using cURL

**Register a new user:**
```bash
curl -X POST https://your-api-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "address": {
      "street": "123 Test St",
      "city": "Test City",
      "zipCode": "12345"
    }
  }'
```

**Get products:**
```bash
curl -X GET https://your-api-url/api/products
```

**Create an order (requires authentication):**
```bash
curl -X POST https://your-api-url/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {
        "productId": "PRODUCT_ID",
        "quantity": 2,
        "price": 1.99
      }
    ],
    "deliveryAddress": {
      "street": "123 Test St",
      "city": "Test City",
      "zipCode": "12345"
    }
  }'
```

### Using Postman

1. Import the API collection: [Download Postman Collection](./postman-collection.json)
2. Set environment variables:
   - `baseUrl`: Your API base URL
   - `token`: JWT token from login/register

---

## 🔒 Security

- **Authentication:** JWT tokens with configurable expiration
- **Password Security:** bcrypt hashing with salt rounds
- **Input Validation:** Joi validation for all inputs
- **CORS:** Configured for frontend domain
- **Rate Limiting:** Prevents API abuse
- **Data Sanitization:** Prevents XSS and injection attacks

---

## 📞 Support

- **API Issues:** [GitHub Issues](https://github.com/HassanRehman9393/aquanest/issues)
- **Email:** api-support@aquanest.com
- **Documentation:** This file is updated regularly

---

<div align="center">
  <p><strong>📚 AquaNest API v1.0</strong></p>
  <p>Built with ❤️ using Express.js and MongoDB</p>
</div>
