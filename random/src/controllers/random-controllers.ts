import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const getRandom = async (req: Request, res: Response, next: NextFunction) => {};

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
