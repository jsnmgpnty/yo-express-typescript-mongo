import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logging';

export function errorHandler(
  err,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = err.error || [{ message: err }];
  Logger.instance.error(err);
  res.status(err.status || 500).json(error);
  next();
}
