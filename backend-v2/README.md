# Backend V2 - TypeScript Version

This is the TypeScript version of the backend, providing the same functionality as the JavaScript version with improved type safety.

## Features

- Full TypeScript implementation
- Same API routes and responses as the JS version
- Console logging works properly (using tsx for development)
- No nodemon - using tsx watch instead
- All existing frontend integrations remain compatible

## Setup

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma Client:
```bash
npx prisma generate
```

3. Run database migrations (if needed):
```bash
npx prisma migrate dev
```

## Development

Run in development mode with hot reload:
```bash
npm run dev
```

The server will start on http://localhost:5000

## Production

Build the TypeScript code:
```bash
npm run build
```

Run the production build:
```bash
npm start
```

## Scripts

- `npm run dev` - Start development server with tsx watch (hot reload, console.log works perfectly)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build

## Environment Variables

Make sure to configure your .env file with:
- PORT
- DATABASE_URL
- JWT_SECRET
- CORS_ORIGIN
- GUEST_EMAIL
- GUEST_PASSWORD
- IMAGEKIT_PUBLIC_KEY
- IMAGEKIT_PRIVATE_KEY
- IMAGEKIT_URL_ENDPOINT

## API Routes

All routes remain the same as the JavaScript version:
- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/categories/*` - Category management
- `/api/carts/*` - Shopping cart
- `/api/addresses/*` - User addresses
- `/api/orders/*` - Order management
- `/api/wishlists/*` - Wishlist management
