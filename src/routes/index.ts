import { Router } from 'express';
import { userRouter } from './user.route';
import { taskRouter } from './task.route';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success
 */
router.use('/users', userRouter);

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Success
 */
router.use('/task', authenticate, taskRouter);

export default router;
