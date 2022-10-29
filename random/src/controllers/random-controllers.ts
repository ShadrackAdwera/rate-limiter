import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '@adwesh/common';

import { RandomDoc, Random, UserDoc, User } from '../models/Random';

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
) => {
  const randomId = req.params.id;
  let foundRandom: (RandomDoc & { _id: string }) | null;

  try {
    foundRandom = await Random.findById(randomId);
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'Internal server error',
        500
      )
    );
  }
  if (!foundRandom)
    return next(new HttpError('This random does not exist', 404));
  res.status(200).json({ random: foundRandom });
};
const addRandom = async (req: Request, res: Response, next: NextFunction) => {
  const isError = validationResult(req);
  if (!isError.isEmpty())
    return next(new HttpError('Please provide a title', 422));
  const userId = req.user?.userId;
  const { title } = req.body;
  let foundUser: (UserDoc & { _id: string }) | null;
  if (!userId)
    return next(
      new HttpError('No user Id found for the provided request', 400)
    );

  try {
    foundUser = await User.findById(userId);
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'Internal server error',
        500
      )
    );
  }

  if (!foundUser)
    return next(
      new HttpError('No user Id found for the provided request', 400)
    );

  const newRando = new Random({
    title,
    createdBy: userId,
  });
  try {
    await newRando.save();
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'Internal server error',
        500
      )
    );
  }
  res.status(201).json({ random: newRando });
};

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
