import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '@adwesh/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return next(new HttpError('Invalid inputs', 422));
  const { email, password }: { email: string; password: string } = req.body;
  let foundUser;
  let hashedPasword;
  let token;

  try {
    foundUser = await User.findOne({ email });
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }

  if (foundUser) return next(new HttpError('Email exists, login instead', 400));

  try {
    hashedPasword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }
  const newUser = new User({ email, password: hashedPasword });

  try {
    await newUser.save();
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }

  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email, tenantId: 1 },
      process.env.JWT_KEY!,
      { expiresIn: '1h' }
    );
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }
  res
    .status(201)
    .json({
      message: 'Sign Up Successful',
      user: { id: newUser.id, email, token },
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  //
};

export { signUp, login };
