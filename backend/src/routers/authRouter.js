import { Router } from 'express';
import { authService } from '../services/authService.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

export const authRouter = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

authRouter.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ success: true, user, token });
  } catch (error) { next(error); }
});

authRouter.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ success: true, user, token });
  } catch (error) { next(error); }
});
