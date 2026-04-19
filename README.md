# StaySource — B2B Hospitality Marketplace

StaySource is a premium B2B marketplace platform designed to connect hotel procurement managers with verified hospitality vendors. The platform streamlines the sourcing process for FF&E (Furniture, Fixtures & Equipment), F&B supplies, linens, technology, and more.

## 🚀 Features

### For Hotel Buyers
- **Curated Marketplace**: Browse thousands of verified vendors across 60+ hospitality categories.
- **Advanced Search**: Filter vendors by category, location, and rating.
- **RFQ System**: Send Request for Quotes (Inquiries) directly to vendors.
- **Saved Vendors**: Keep track of preferred suppliers in a dedicated list.
- **Reviews & Ratings**: Evaluate vendors based on verified community feedback.

### For Vendors
- **Business Profile**: Showcase products, services, and hospitality-specific expertise.
- **Inquiry Management**: Receive and respond to qualified leads from hotel owners.
- **Analytics Dashboard**: Monitor profile engagement and inquiry metrics.
- **Product Catalog**: Manage a digital inventory of offerings.

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, React Router 6, Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: JWT-based Secure Authentication.
- **Security**: Helmet, CORS, and Express Validator.

## 📂 Project Structure

```text
staysource/
├── backend/            # Express REST API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── config/       # Database & Environment config
│   └── server.js         # Entry point
├── frontend/           # Vite + React App
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components/views
│   │   ├── context/      # State management (Auth)
│   │   └── api/          # Axios API instances
│   └── index.html
└── README.md
```

## 🚥 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Running instance)

### 1. Setup Backend
```bash
cd backend
npm install
# Configure your .env file
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
# Configure your .env file
npm run dev
```

## 🔑 Environment Variables

### Backend (`/backend/.env`)
- `PORT`: 5000
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your secure secret key
- `JWT_EXPIRES_IN`: 7d
- `CLIENT_URL`: http://localhost:5173

### Frontend (`/frontend/.env`)
- `VITE_API_URL`: http://localhost:5000/api

---

© 2026 StaySource. Dedicated to hospitality excellence.
