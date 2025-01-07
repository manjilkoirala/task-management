import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  loginUser,
  registerUser,
} from '../controllers/users.controller';
import {
  getUserValidator,
  loginUserValidator,
  registerUserValidator,
} from '../validators/user.validator';
import { authenticate } from '../middlewares/auth';
import { authorizeAdmin } from '../middlewares/authorizeAdmin';
import { upload } from '../middlewares/multer';

const router = Router();

//user routes
router.post(
  '/register',
  upload.single('profilePic'),
  registerUserValidator,
  registerUser,
);
router.post('/login', loginUserValidator, loginUser);
router.get('/', authenticate, authorizeAdmin, getAllUsers);
router.get('/:id', authenticate, authorizeAdmin, getUserValidator, getUser);

export { router as userRouter };
