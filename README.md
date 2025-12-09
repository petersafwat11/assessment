# Marketplace Frontend

A React-based e-commerce frontend application built with Vite, featuring authentication, product browsing, shopping cart, and order management.

## Features

### Core Features (Required)

- **Authentication** - Login/Register with JWT token storage and protected routes
- **Products** - Browse products with filtering, sorting, and search
- **Product Details** - View detailed product information with reviews
- **Shopping Cart** - Add, update, remove items with persistent storage

### Additional Features

- **User Profile** - View and edit user profile information
- **Order History** - Track orders (localStorage-based)
- **Favorites/Wishlist** - Save favorite products (localStorage-based)
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form validation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icon library

## Project Structure

```
src/
├── components/
│   ├── auth/           # Login & Register forms
│   ├── cart/           # Cart item & summary components
│   ├── common/         # Reusable UI components
│   ├── layout/         # Header, Footer, Layout
│   └── products/       # Product cards, grid, filters
├── contexts/
│   ├── AuthContext.jsx     # Authentication state
│   ├── CartContext.jsx     # Shopping cart state
│   ├── FavoritesContext.jsx # Favorites state
│   └── OrdersContext.jsx   # Orders state
├── pages/
│   ├── Home.jsx           # Landing page
│   ├── Login.jsx          # Login page
│   ├── Register.jsx       # Registration page
│   ├── Products.jsx       # Product listing
│   ├── ProductDetail.jsx  # Single product view
│   ├── Cart.jsx           # Shopping cart
│   ├── Checkout.jsx       # Checkout process
│   ├── Profile.jsx        # User profile
│   ├── Orders.jsx         # Order history
│   └── Favorites.jsx      # Saved favorites
├── services/
│   └── api.js             # API service layer
├── utils/
│   ├── helpers.js         # Utility functions
│   └── storage.js         # localStorage helpers
├── App.jsx                # Main app with routing
├── main.jsx               # Entry point
└── index.css              # Global styles & Tailwind
```

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running on http://localhost:3000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Test Credentials

- **Email**: `john.doe@example.com`
- **Password**: `password123`

## API Integration

The frontend connects to the Marketplace Backend API at `http://localhost:3000/api`.

### Endpoints Used

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/products` - List products (with filtering)
- `GET /api/products/:id` - Product details
- `GET /api/categories` - List categories
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart

## State Management

- **AuthContext** - Manages user authentication state with JWT tokens
- **CartContext** - Manages shopping cart with localStorage fallback for guests
- **FavoritesContext** - Manages favorites list in localStorage
- **OrdersContext** - Manages order history in localStorage

## Key Design Decisions

1. **Remember Me** - Uses localStorage for persistent login, sessionStorage for session-only
2. **Guest Cart** - Cart works without authentication using localStorage
3. **Local Orders** - Orders stored in localStorage for demo purposes
4. **Component Organization** - Components grouped by feature/page for scalability
