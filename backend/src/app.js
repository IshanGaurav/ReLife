import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { authRouter } from './routers/authRouter.js';
import { apiRouter } from './routes/apiRoutes.js';
import { userRouter } from './routers/userRouter.js';
import { connectDB } from './config/db.js';

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// New unified API Router for the MongoDB Migration
app.use('/api/v2', apiRouter);

// Global Error Handler
app.use(errorMiddleware);

export default app;
