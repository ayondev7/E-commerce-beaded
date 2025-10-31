# Beaded - E-Commerce Platform

A full-stack e-commerce platform built with modern web technologies, featuring a robust backend API and an intuitive frontend shopping experience. This platform enables users to browse products, manage their cart and wishlist, place orders, and handle their profile seamlessly.

## Features

### Customer Features
- **Authentication & Authorization**: Secure user authentication with JWT tokens, supporting credential-based login, Google OAuth, and guest access
- **Product Browsing**: Browse products with filtering, sorting, and pagination capabilities
- **Product Collections**: Explore best sellers, latest collections, and exclusive collections
- **Search & Filter**: Advanced product filtering by category, collection, and price range
- **Shopping Cart**: Add, update, and remove items from cart with real-time quantity management
- **Wishlist**: Save favorite products for later purchase
- **Order Management**: Place orders, track order status, and view order history
- **Address Management**: Add, update, and manage multiple delivery addresses with default address selection
- **User Profile**: Update personal information, profile picture, and account settings
- **Responsive Design**: Fully responsive interface optimized for all devices

### Admin Features
- **Product Management**: Create, update, and delete products with image uploads
- **Category Management**: Organize products into categories with custom images
- **Order Processing**: Manage and update order statuses
- **Inventory Control**: Track product availability and manage stock

### Technical Features
- **Image Processing**: Optimized image uploads with automatic compression and resizing using Sharp
- **Cloud Storage**: Integrated with ImageKit for efficient image storage and CDN delivery
- **Database Transactions**: Ensures data integrity with Prisma transactions for complex operations
- **Error Handling**: Centralized error handling with custom error classes for consistent API responses
- **Rate Limiting**: Built-in protection against API abuse
- **Input Validation**: Comprehensive validation using Zod schemas
- **Token Refresh**: Automatic access token refresh for seamless user experience
- **Secure Password Storage**: Passwords hashed with bcrypt
- **CORS Configuration**: Configurable cross-origin resource sharing

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Form Handling**: Formik
- **Authentication**: NextAuth.js v5
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React & React Icons
- **Carousel**: Embla Carousel
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns & React Day Picker

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Image Processing**: Sharp
- **Cloud Storage**: ImageKit
- **File Upload**: Multer
- **Validation**: Zod
- **Rate Limiting**: express-rate-limit
- **Slug Generation**: slugify
- **Security**: CORS, cookie-parser

### Development Tools
- **TypeScript**: Type safety across the stack
- **ESLint**: Code quality and consistency
- **TSX**: Fast TypeScript execution for development
- **Turbopack**: Ultra-fast Next.js compilation

## Architecture Highlights

### Backend Architecture
- **Modular Structure**: Organized by feature modules (auth, products, cart, orders, etc.)
- **Service Layer Pattern**: Business logic separated from controllers
- **Custom Error Classes**: Semantic HTTP error responses
- **Async Handler Wrapper**: Automatic error catching for async operations
- **Transaction Support**: Database transactions for data consistency
- **Middleware Pipeline**: Authentication, validation, and error handling middleware
- **RESTful API Design**: Clean and intuitive API endpoints

### Frontend Architecture
- **App Router**: Utilizing Next.js App Router for better performance
- **Server Components**: Leveraging React Server Components where applicable
- **Client-Side State**: Global state management with Zustand
- **Data Caching**: Optimized data fetching with React Query
- **Route Protection**: Client-side route guards for authenticated routes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Reusable UI components built with Radix UI
- **Type Safety**: End-to-end type safety with TypeScript

## Security Features

- JWT-based authentication with access and refresh tokens
- Secure password hashing with bcrypt
- HTTP-only cookies for token storage
- CORS protection with configurable origins
- Rate limiting to prevent API abuse
- Input validation and sanitization
- SQL injection protection through Prisma
- XSS protection through React's built-in escaping

## Performance Optimizations

- Image optimization with Sharp and ImageKit CDN
- Database query optimization with Prisma
- React Query for efficient data caching and refetching
- Code splitting with Next.js dynamic imports
- Lazy loading of images and components
- Turbopack for faster development builds
- PostgreSQL indexing for quick lookups
- Connection pooling for database efficiency

## API Features

- RESTful API design with clear endpoint structure
- Pagination support for large datasets
- Advanced filtering and sorting capabilities
- Partial updates with PATCH endpoints
- Bulk operations where applicable
- Consistent error response format
- Request validation middleware
- Optional authentication for public endpoints

---

Built with ❤️ using modern web technologies
