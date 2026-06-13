import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { authRouter } from './routers/authRouter.js';
import { productRouter } from './routers/productRouter.js';
import { userRouter } from './routers/userRouter.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

// Global Error Handler
app.use(errorMiddleware);

export default app;
