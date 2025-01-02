import { body, param } from 'express-validator';

//create task validator
export const createTaskValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('deadline').notEmpty().withMessage('Deadline is required'),
];

//get task by id validator
export const getTaskValidator = [
  param('id').notEmpty().withMessage('Task id is required'),
];

//update task validator
export const updateTaskValidator = [
  param('id').notEmpty().withMessage('Task id is required'),
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty if provided'),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty if provided'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
];

//delete task validator
export const deleteTaskValidator = [
  param('id').notEmpty().withMessage('Task id is required'),
];
