import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";
import express from "express";
import dontenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import cors from "cors";

dontenv.config();
connectDB();

const app = express();
app.use(cors(corsConfig));
app.use(express.json())

app.use('/api/auth', authRoutes);

export default app;