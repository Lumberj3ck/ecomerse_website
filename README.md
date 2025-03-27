# E-commerce Project

A full-stack e-commerce application built with Vue.js, Node.js, Express, and SQLite. The project includes features like product listing, shopping cart, user authentication, and PayPal payment integration.

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)

## Project Structure

```
ecommerce/
├── backend/         # Express server
├── frontend/        # Vue.js application
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=3000
JWT_SECRET=your_jwt_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

4. Initialize the database and seed products:
```bash
npm run seed
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# OR Production mode
npm start
```

The backend server will run on `http://localhost:3000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will run on `http://localhost:5173`

## Features

- Product catalog with images and descriptions
- User authentication (register/login)
- Shopping cart functionality
- PayPal payment integration
- Order management
- Responsive design using Element Plus UI library

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Cart & Checkout
- `POST /api/checkout/create-order 