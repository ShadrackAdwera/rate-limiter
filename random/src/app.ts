import { HttpError } from '@adwesh/common';
import express, { Request, Response, NextFunction } from 'express';
import { randomRouter } from './routes/random-routes';

const app = express();

app.use(express.json());
app.use('/api/random', randomRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  throw new HttpError('This method / route does not exist', 404);
});

app.use((error: HttpError, eq: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500).json({ message: error.message || 500 });
});

export { app };
