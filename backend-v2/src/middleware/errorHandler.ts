import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  }

  console.error('Unexpected Error:', err);
  
  return res.status(500).json({
    message: 'Internal server error'
  });
};
