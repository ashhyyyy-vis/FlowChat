import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import deviceIdMiddleware from "./middleware/deviceId";
import onboardingRoute from "./routes/onboarding.routes";
import reportRoutes from "./routes/report.routes";
import verificationRoute from "./routes/verification.routes";
// Create the Express application
const app = express();

// Middleware
app.use(cors({
    origin:  process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

app.use(deviceIdMiddleware);
app.use('/api',onboardingRoute);
app.use('/api', verificationRoute)

app.use("/api/report", reportRoutes);


// Error handling middleware
import { errorHandler } from "./middleware/errorHandler";

// ... all routes above this

app.use(errorHandler);


// Export the configured app
export default app;