import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logging';

export function errorHandler(
  err,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = err.errors || [{ message: err.message }];
  Logger.instance.error(errors);
  res.status(err.status || 500).json({ errors });
}
