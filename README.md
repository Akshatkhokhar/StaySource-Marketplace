# StaySource B2B Marketplace

StaySource is a premium B2B hospitality marketplace designed to connect hotel procurement managers with verified vendors. Built with a focus on "Architectural Precision," the platform provides a seamless, high-end experience for sourcing, communication, and verified reviews.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "QUANTO NEURAL"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm run seed # Populate initial data
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🏗 Project Structure

```text
/QUANTO NEURAL
├── /backend                # Express & Node.js REST API
│   ├── /src
│   │   ├── /controllers    # Request handlers
│   │   ├── /models         # Mongoose schemas
│   │   ├── /routes         # API endpoints
│   │   ├── /services       # Business logic
│   │   └── /utils          # Shared helpers
│   └── server.js           # Entry point
├── /frontend               # React & Vite Application
│   ├── /src
│   │   ├── /api            # Axios clients
│   │   ├── /components     # UI building blocks
│   │   ├── /context        # Auth & Shared State
│   │   ├── /pages          # Full view screens
│   │   └── /routes         # Route guards & definitions
│   └── index.html
└── README.md
```

## ✨ Core Features

### 🏢 Dual Role Ecosystem
- **Hotel Owners (Buyers)**: Discover vendors, send RFQs, save partners, and leave verified reviews.
- **Vendors**: Manage professional profiles, upload product inventories, and track leads in real-time.

### 📦 Marketplace & Sourcing
- **Category-Based Browsing**: Browse 60+ hospitality categories from Linens to Tech.
- **Advanced Search**: Filter by location, rating, and expertise.
- **Product Inventory**: Explore detailed vendor catalogs with pricing and stock status.

### 💬 Integrated RFQ & Messaging
- **Direct Enquiries**: Send Requests for Quote (RFQ) directly from vendor profiles.
- **Real-time Chat**: Unified communication interface for hotel managers and vendors to discuss requirements.

### ⭐ Trust & Engagement
- **Verified Reviews**: Robust feedback system where only hotel professionals can leave ratings.
- **Aggregate Scoring**: Automatic calculation of vendor performance metrics.
- **Saved Vendors**: Bookmark feature for building preferred supplier lists.

### 📱 Premium Design
- **Responsive Architecture**: Fully optimized for Desktop, Tablet, and Mobile.
- **Curated Aesthetics**: Uses the "Architectural Curator" design system (Navy & Gold) for a prestigious feel.

## 🛠 Tech Stack
- **Frontend**: React.js, Vite, React Router, Axios, React Toastify.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB.
- **Identity**: JWT-based Authentication.

## 🔌 API Command Reference
- **List All Vendors**: `GET /api/vendors`
- **Search Vendors**: `GET /api/search/vendors`
- **Submit RFQ**: `POST /api/inquiries`
- **Post Review**: `POST /api/reviews`
