# AquaNest API Testing Guide

## Base URL
- Development: `http://localhost:5000`
- Production: `https://your-api-domain.com`

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## API Endpoints

### 🔐 Authentication (`/api/auth`)

#### 1. Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

#### 2. Login User
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

#### 3. Get Current User Profile
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer TOKEN`

#### 4. Update User Profile
- **PUT** `/api/auth/profile`
- **Headers:** `Authorization: Bearer TOKEN`
- **Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210"
  }
}
```

#### 5. Change Password
- **PUT** `/api/auth/change-password`
- **Headers:** `Authorization: Bearer TOKEN`
- **Body:**
```json
{
  "currentPassword": "123456",
  "newPassword": "newpassword123"
}
```

### 🛍️ Products (`/api/products`)

#### 1. Get All Products
- **GET** `/api/products`
- **Query Params:** `category`, `search`, `page`, `limit`, `sort`

#### 2. Get Single Product
- **GET** `/api/products/:id`

#### 3. Advanced Product Search
- **GET** `/api/products/search`
- **Query Params:** `q`, `category`, `minPrice`, `maxPrice`, `inStock`, `sort`

#### 4. Create Product (Admin Only)
- **POST** `/api/products`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`
- **Body:**
```json
{
  "name": "Premium Water Bottle",
  "description": "High-quality stainless steel water bottle",
  "price": 29.99,
  "category": "bottle",
  "size": "500ml",
  "volume": 0.5,
  "stock": 100,
  "features": ["BPA-free", "Insulated", "Leak-proof"],
  "specifications": {
    "material": "Stainless Steel",
    "color": "Blue",
    "weight": "300g"
  }
}
```

#### 5. Update Product (Admin Only)
- **PUT** `/api/products/:id`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`

#### 6. Delete Product (Admin Only)
- **DELETE** `/api/products/:id`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`

#### 7. Bulk Delete Products (Admin Only)
- **DELETE** `/api/products/bulk`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`
- **Body:**
```json
{
  "productIds": ["product_id_1", "product_id_2"]
}
```

#### 8. Product Analytics (Admin Only)
- **GET** `/api/products/analytics`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`

### 📦 Orders (`/api/orders`)

#### 1. Create Order
- **POST** `/api/orders`
- **Headers:** `Authorization: Bearer TOKEN`
- **Body:**
```json
{
  "orderItems": [
    {
      "product": "PRODUCT_ID",
      "name": "Water Bottle",
      "price": 29.99,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "paymentMethod": "credit_card",
  "itemsPrice": 59.98,
  "taxPrice": 4.80,
  "shippingPrice": 9.99,
  "totalPrice": 74.77
}
```

#### 2. Get My Orders
- **GET** `/api/orders/myorders`
- **Headers:** `Authorization: Bearer TOKEN`

#### 3. Get Order by ID
- **GET** `/api/orders/:id`
- **Headers:** `Authorization: Bearer TOKEN`

#### 4. Update Order to Paid
- **PUT** `/api/orders/:id/pay`
- **Headers:** `Authorization: Bearer TOKEN`
- **Body:**
```json
{
  "id": "payment_id",
  "status": "completed",
  "update_time": "2025-06-19T10:30:00Z",
  "payer": {
    "email_address": "john@example.com"
  }
}
```

#### 5. Cancel Order
- **PUT** `/api/orders/:id/cancel`
- **Headers:** `Authorization: Bearer TOKEN`

#### 6. Get Order Statistics
- **GET** `/api/orders/stats`
- **Headers:** `Authorization: Bearer TOKEN`

#### 7. Get All Orders (Admin Only)
- **GET** `/api/orders`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`
- **Query Params:** `page`, `limit`, `status`

#### 8. Update Order Status (Admin Only)
- **PUT** `/api/orders/:id/status`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`
- **Body:**
```json
{
  "status": "shipped"
}
```

### 👨‍💼 Admin (`/api/admin`)

#### 1. Dashboard Statistics
- **GET** `/api/admin/dashboard`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`

#### 2. Get All Users
- **GET** `/api/admin/users`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`
- **Query Params:** `page`, `limit`, `search`, `role`

#### 3. Update User Status
- **PUT** `/api/admin/users/:id/status`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`
- **Body:**
```json
{
  "isActive": false
}
```

#### 4. Delete User
- **DELETE** `/api/admin/users/:id`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`

#### 5. Sales Analytics
- **GET** `/api/admin/analytics`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`
- **Query Params:** `period` (days, default: 30)

#### 6. Bulk Update Product Stock
- **PUT** `/api/admin/products/bulk-stock`
- **Headers:** `Authorization: Bearer ADMIN_TOKEN`
- **Body:**
```json
{
  "updates": [
    {
      "productId": "PRODUCT_ID_1",
      "stock": 50
    },
    {
      "productId": "PRODUCT_ID_2",
      "stock": 25
    }
  ]
}
```

### 🔧 Utility

#### Health Check
- **GET** `/api/health`

## Testing Workflow

### 1. Basic Flow
1. Register a new user
2. Login to get JWT token
3. Create some products (as admin)
4. Place an order
5. Check order status

### 2. Admin Flow
1. Login as admin
2. Check dashboard stats
3. Manage users
4. View analytics
5. Manage products

### 3. Error Testing
- Try accessing protected routes without token
- Try invalid data in requests
- Try accessing admin routes with regular user token

## Common HTTP Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Internal Server Error
