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
import { countAndLimitRequests } from '../middlewares/countRequests';

const router = Router();

router.use(checkAuth);
router.get('', countAndLimitRequests, getRandom);
router.get('/:id', countAndLimitRequests, getRandomById);
router.post('/new', [body('title').trim().isLength({ min: 5 })], addRandom);
router.patch('/:id', [body('title').trim().isLength({ min: 5 })], updateRandom);
router.delete('/:id', deleteRandom);

export { router as randomRouter };
