// Enable passing async errors down to the error handler seamlessly
require('express-async-errors');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./src/config/db');
const checkEnv = require('./src/config/env');
const routes = require('./src/routes/index');
const errorHandler = require('./src/middlewares/error.middleware');

// Load environment variables
dotenv.config();

// Validate required environment variables
checkEnv();

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes hookup
app.use('/api', routes);

// 404 handler for non-API routes (or any route not caught by the API router)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Page not found'
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});
