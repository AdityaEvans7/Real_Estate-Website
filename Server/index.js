import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';

dotenv.config();

const app = express();

// CORS setup to allow requests from frontend running at http://localhost:5173
const corsOptions = {
  origin: 'http://localhost:5173',  // your React app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // allowed headers
  credentials: true,  // Allow cookies to be sent with the requests
};

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());

// Apply the CORS middleware with the updated configuration
app.use(cors(corsOptions));  // Apply CORS with the options

// Your routes
app.use('/api/user', userRoute);
app.use("/api/residency", residencyRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
