import { checkAuth } from '@adwesh/common';
import { Router } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import {
  getRandom,
  getRandomById,
  addRandom,
  updateRandom,
  deleteRandom,
} from '../controllers/random-controllers';

const router = Router();

router.use(checkAuth);
router.get('', getRandom);
router.get('/:id', getRandomById);
router.post(
  '/new',
  [
    body('title').trim().isLength({ min: 5 }),
    body('createdBy')
      .trim()
      .custom((id: string) => mongoose.Types.ObjectId.isValid(id)),
  ],
  addRandom
);
router.patch('/:id', [body('title').trim().isLength({ min: 5 })], updateRandom);
router.delete('/:id', deleteRandom);

export { router as randomRouter };
