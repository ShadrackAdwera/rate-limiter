import { HttpError } from '@adwesh/common';
import express, { Request, Response, NextFunction } from 'express';

import { authRouter } from './routes/auth-routes';

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  throw new HttpError('Method / Route does not exist', 404);
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An error occured, try again' });
});

export { app };
