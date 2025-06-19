# 🌊 AquaNest - Premium Water Delivery Service

A modern, full-stack water delivery website built with Next.js and Express.js, featuring real-time ordering, admin dashboard, and smooth animations.

## 🚀 Features

### Customer Features
- 🏠 **Home Page** - Hero section with animated water bottle and company overview
- 🧪 **Product Catalog** - Browse water bottles, gallons, and dispensers with filtering
- 🛒 **Shopping Cart** - Add to cart with smooth animations and quantity management
- 🔐 **User Authentication** - Secure login/register with JWT tokens
- 📦 **Order Tracking** - Real-time order status updates and delivery tracking
- 📱 **Responsive Design** - Mobile-first design with cross-device compatibility

### Admin Features
- 📊 **Admin Dashboard** - Comprehensive order and product management
- 📈 **Analytics** - Sales charts and business insights
- 🏷️ **Product Management** - Add, edit, delete products with image uploads
- 🚚 **Order Management** - Update order status and track deliveries

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcryptjs
- **Validation:** Joi
- **File Upload:** Multer

## 📁 Project Structure

```
aquanest/
├── frontend/                 # Next.js app
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable components
│   │   ├── lib/             # Utilities & config
│   │   ├── store/           # Zustand stores
│   │   └── types/           # TypeScript types
│   └── public/              # Static assets
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── middleware/      # Custom middleware
│   └── uploads/             # File uploads
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aquanest.git
   cd aquanest
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend (.env)
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secret

   # Frontend (.env.local)
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Run the application**
   ```bash
   # Start backend (Terminal 1)
   cd backend
   npm run dev

   # Start frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🌐 Deployment

### Live Demo
- **Frontend:** [https://aquanest.vercel.app](https://aquanest.vercel.app)
- **Backend API:** [https://aquanest-api.railway.app](https://aquanest-api.railway.app)

### Deployment Platforms
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** MongoDB Atlas

## 📊 API Documentation

### Base URL
```
Production: https://aquanest-api.railway.app/api
Development: http://localhost:5000/api
```

### Key Endpoints
```
POST /auth/register     - User registration
POST /auth/login        - User login
GET  /products          - Get all products
POST /orders            - Create new order
GET  /orders/:userId    - Get user orders
```

For detailed API documentation, see [API.md](./API.md)

## 🎨 Design Features

- **Modern UI/UX** - Clean, professional design with blue/aqua theme
- **Smooth Animations** - Framer Motion powered transitions and interactions
- **Mobile-First** - Responsive design optimized for all devices
- **Accessibility** - WCAG compliant with proper contrast and navigation

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS protection
- Rate limiting

## 🚧 Development Status

- [x] Project setup and configuration
- [x] Backend API development
- [x] User authentication system
- [x] Frontend pages and components
- [x] Shopping cart functionality
- [x] Admin dashboard
- [x] Deployment and testing

## 📝 Development Timeline

This project was developed over 3 days following a structured approach:
- **Day 1:** Backend setup and authentication
- **Day 2:** Frontend development and integration
- **Day 3:** Admin panel, testing, and deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer:** [Your Name]
- **Design:** Modern water delivery UX/UI
- **Timeline:** 3-day development sprint

## 📞 Contact

For questions or support, please contact [your-email@example.com]

---

**Built with ❤️ for AquaNest Water Delivery Service**
