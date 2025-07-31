import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes';  // Import routes
import { ErrorRequestHandler } from 'express';
import dotenv from "dotenv";
import transactionRoutes from "../src/routes/transactionRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.error(err); 
    res.status(500).json({ message: 'Something went wrong', error: err });
});

export default app;
