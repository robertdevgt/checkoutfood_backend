import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";
import express from "express";
import dontenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";
import orderRoutes from "./routes/orderRoutes";
import cors from "cors";
import path from "path";

dontenv.config();
connectDB();

const app = express();

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.use(cors(corsConfig));
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

export default app;