import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpError, natsWraper } from '@adwesh/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';
import { UserCreatedPublisher } from '../events/UserCreatedPublisher';

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

  try {
    await new UserCreatedPublisher(natsWraper.client).publish({
      id: newUser.id,
      email: newUser.email,
      category: '',
    });
  } catch (error) {
    return next(
      new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      )
    );
  }

  res.status(201).json({
    message: 'Sign Up Successful',
    user: { id: newUser.id, email, token },
  });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }
  let foundUser;
  let isPassword: boolean;
  let token: string;
  const { email, password } = req.body;

  //check if email exists in the DB
  try {
    foundUser = await User.findOne({ email }).exec();
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }
  if (!foundUser) {
    return next(new HttpError('Email does not exist, sign up instead', 404));
  }

  //compare passwords
  try {
    isPassword = await bcrypt.compare(password, foundUser.password);
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  if (!isPassword) {
    return next(new HttpError('Invalid password', 422));
  }

  //generate token --- also sign using tenant id
  try {
    token = await jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      process.env.JWT_KEY!,
      { expiresIn: '1h' }
    );
  } catch (error) {
    return next(new HttpError('An error occured, try again', 500));
  }

  res.status(200).json({
    message: 'Login Successful',
    user: { id: foundUser.id, email, token },
  });
};

export { signUp, login };
