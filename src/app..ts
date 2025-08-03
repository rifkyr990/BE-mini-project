import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';           // import cors
import authRoutes from './routes/authRoutes';
import dotenv from "dotenv";
import transactionRoutes from "../src/routes/transactionRoutes";
import eventRoutes from "../src/routes/eventRoutes";

dotenv.config();

const app = express();

app.use(cors({ 
  origin: process.env.FRONTEND_URL || '*'  // ganti dengan URL frontend kamu misal: http://localhost:3000
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/events", eventRoutes);

// Middleware error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err); 
    res.status(500).json({ message: 'Something went wrong', error: err.message || err });
});

export default app;
