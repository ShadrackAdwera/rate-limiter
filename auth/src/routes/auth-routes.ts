import { Router } from 'express';
import { body } from 'express-validator';

import { login, signUp } from '../controllers/auth-controllers';

const router = Router();

router.post(
  '/sign-up',
  [
    body('email').normalizeEmail().isEmail(),
    body('password').trim().isLength({ min: 6 }),
  ],
  signUp
);
router.post('/login', [body('email').normalizeEmail().isEmail()], login);

export { router as authRouter };
