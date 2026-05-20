import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware.js';
import { logger } from './middleware/logger.middleware.js';
import { notFound } from './middleware/notFound.middleware.js';


const app = express();

// Middleware
// Enable CORS for all routes
app.use(cors());

// Enable Helmet for security headers
app.use(helmet());

// Enable Morgan for logging HTTP requests
app.use(morgan('dev'));

// Enable JSON parsing and URL-encoded data parsing
app.use(express.json());

// Enable parsing of URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static("public"))

// Enable cookie parsing
app.use(cookieParser());

// Custom Middleware to track request
app.use(logger);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Social Media Backend API! 🏠');
});



// routes import
import userRoutes from './routes/auth.route.js';


// route declaration
app.use('/api/v1/auth', userRoutes);

// CHECK INVALID ROUTES
app.use(notFound);

// ERROR CHECK MIDDLEWARE 
app.use(errorHandler);

export default app;