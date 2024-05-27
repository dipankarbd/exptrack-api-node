import { NextFunction, Request, Response } from 'express';
import { UnauthorisedError } from '../account/shared/error';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof UnauthorisedError) {
    res
      .status(401)
      .json({ error: 'You are not authorized to access this resource' });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
