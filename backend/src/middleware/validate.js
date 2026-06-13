import { ValidationError } from '../errors/index.js';

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    // ZodError
    const messages = error.errors?.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
    next(new ValidationError(messages || 'Validation Failed'));
  }
};
