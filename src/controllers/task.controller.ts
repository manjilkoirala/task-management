import { Request, Response, NextFunction } from 'express';
import { Task } from '../models/task.model';
import ResponseService from '../services/response.service';
import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import redisClient from '../services/radisClient';

export const createTask = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, status, priority, deadline } = req.body;
    const { role, id } = req.user as IUser;

    const assignee = await User.findById(id);
    if (!assignee) {
      return ResponseService.error(res, 'User not found', null, 404);
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      deadline,
      assignee: id,
    });

    // Invalidate relevant cache keys
    try {
      const cachePattern = `tasks:${role}:${id}:*`;
      console.log('Cache Pattern:', cachePattern); // Log the cache pattern
      const keys = await redisClient.keys(cachePattern);
      console.log('Deleting...', keys);

      if (keys.length > 0) {
        await redisClient.del(...(keys as any));
        console.log(`Invalidated ${keys.length} cache keys:`, keys);
      }
    } catch (redisError) {
      console.error('Failed to invalidate cache:', redisError);
    }

    return ResponseService.success(res, 'Task created successfully', newTask);
  } catch (error) {
    next(error);
  }
};

// Get all tasks (for admin all tasks, for user only assigned tasks)
export const getTasks = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { role, id } = req.user as IUser;
    const {
      sortBy = 'createdAt',
      order = 'asc',
      page = 1,
      limit = 10,
    } = req.query;

    //validate pagination query
    if (isNaN(Number(page)) || isNaN(Number(limit))) {
      return ResponseService.error(res, 'Invalid pagination query', null, 400);
    }
    const pageNumber = Math.max(parseInt(page as string, 10) || 1, 1);
    const pageSize = Math.max(parseInt(limit as string, 10) || 10, 1);

    //validate
    const validSortField = ['createdAt', 'deadline', 'priority'];
    if (!validSortField.includes(sortBy as string)) {
      return ResponseService.error(res, 'Invalid sort field', null, 400);
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    // Define query and pagination logic
    let query = role === 'admin' ? {} : { assignee: id };

    //Generate unique cache key
    const cacheKey = `tasks:${role}:${id}:${sortBy}:${order}:${page}:${limit}`;
    console.log('Generated Cache Key:', cacheKey); // Log the cache key

    //Check if data is in cache
    const cachedTasks = await redisClient.get(cacheKey);
    if (cachedTasks) {
      console.log('Data retrieved from cache');
      return ResponseService.success(
        res,
        'Tasks retrieved successfully (from cache)',
        JSON.parse(cachedTasks),
      );
    }
    console.log('Data retrieved from database');

    const tasks = await Task.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip((pageNumber - 1) * pageSize) // Skip tasks for previous pages
      .limit(pageSize); // Limit tasks per page

    const response = {
      total: tasks.length,
      page: pageNumber,
      limit: pageSize,
      tasks: tasks,
    };

    //Store data in cache
    await redisClient.set(cacheKey, JSON.stringify(response), { EX: 60 });

    return ResponseService.success(
      res,
      'Tasks retrieved successfully',
      response,
    );
  } catch (error) {
    next(error);
  }
};

// Get a single task
export const getTaskbyId = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user as IUser;
    const task = await Task.findById({ _id: id });
    if (!task) return ResponseService.error(res, 'Task not found', null, 404);
    if (role !== 'admin' && task.assignee.toString() !== _id.toString()) {
      return ResponseService.error(
        res,
        'You are not authorized to view this task',
        null,
        403,
      );
    }
    return ResponseService.success(res, 'Task retrieved successfully', task);
  } catch (error) {
    next(error);
  }
};

// Update a task
export const updateTask = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user as IUser;
    const { title, description, status, priority, deadline } = req.body;
    const task = await Task.findById({ _id: id });
    if (!task) return ResponseService.error(res, 'Task not found', null, 404);
    if (role !== 'admin' && task.assignee.toString() !== _id.toString()) {
      return ResponseService.error(
        res,
        'You are not authorized to update this task',
        null,
        403,
      );
    }
    const updatedTask = await Task.findByIdAndUpdate(
      { _id: id },
      { title, description, status, priority, deadline },
      { new: true },
    );
    return ResponseService.success(
      res,
      'Task updated successfully',
      updatedTask,
    );
  } catch (error) {
    next(error);
  }
};

// Delete a task
export const deleteTask = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user as IUser;
    const task = await Task.findById({ _id: id });
    if (!task) return ResponseService.error(res, 'Task not found', null, 404);
    if (role !== 'admin' && task.assignee.toString() !== _id.toString()) {
      return ResponseService.error(
        res,
        'You are not authorized to delete this task',
        null,
        403,
      );
    }
    await Task.findByIdAndDelete(id);
  } catch (error) {}
};
