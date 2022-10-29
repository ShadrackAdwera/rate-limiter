import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '@adwesh/common';

import { RandomDoc, Random } from '../models/Random';

const getRandom = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  if (!userId)
    return next(
      new HttpError('No user Id found for the provided request', 400)
    );

  let randoms: (RandomDoc & { _id: string })[];

  try {
    randoms = await Random.find({ createdBy: userId });
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'Internal server error',
        500
      )
    );
  }
  res.status(200).json({ randoms });
};

const getRandomById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
const addRandom = async (req: Request, res: Response, next: NextFunction) => {};

const updateRandom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const deleteRandom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export { getRandom, getRandomById, addRandom, updateRandom, deleteRandom };
