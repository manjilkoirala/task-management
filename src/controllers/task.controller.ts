import { Request, Response, NextFunction } from "express";
import { Task } from "../models/task.model";
import ResponseService from "../services/response.service";
import { User } from "../models/user.model";
import { IUser } from "../interfaces/user.interface";

export const createTask = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, status, priority, deadline } = req.body;
    const userId = req.user?.id as IUser;

    const assignee = await User.findById(userId);
    if (!assignee) {
      return ResponseService.error(res, "User not found", null, 404);
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      deadline,
      assignee: userId,
    });

    return ResponseService.success(res, "Task created successfully", newTask);
  } catch (error) {
    next(error);
  }
};

// Get all tasks (for admin all tasks, for user only assigned tasks)
export const getTasks = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, id } = req.user as IUser;
    let tasks;
    if (role === "admin") {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ assignee: id });
    }
    return ResponseService.success(res, "Tasks retrieved successfully", {
      tasks: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single task
export const getTaskbyId = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user as IUser;
    const task = await Task.findById({ _id: id });
    if (!task) return ResponseService.error(res, "Task not found", null, 404);
    if (role !== "admin" && task.assignee.toString() !== _id.toString()) {
      return ResponseService.error(
        res,
        "You are not authorized to view this task",
        null,
        403
      );
    }
    return ResponseService.success(res, "Task retrieved successfully", task);
  } catch (error) {
    next(error);
  }
};

// Update a task
export const updateTask = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user as IUser;
    const { title, description, status, priority, deadline } = req.body;
    const task = await Task.findById({ _id: id });
    if (!task) return ResponseService.error(res, "Task not found", null, 404);
    if (role !== "admin" && task.assignee.toString() !== _id.toString()) {
      return ResponseService.error(
        res,
        "You are not authorized to update this task",
        null,
        403
      );
    }
    const updatedTask = await Task.findByIdAndUpdate(
      { _id: id },
      { title, description, status, priority, deadline },
      { new: true }
    );
    return ResponseService.success(
      res,
      "Task updated successfully",
      updatedTask
    );
  } catch (error) {
    next(error);
  }
};

// Delete a task
export const deleteTask = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user as IUser;
    const task = await Task.findById({ _id: id });
    if (!task) return ResponseService.error(res, "Task not found", null, 404);
    if (role !== "admin" && task.assignee.toString() !== _id.toString()) {
      return ResponseService.error(
        res,
        "You are not authorized to delete this task",
        null,
        403
      );
    }
    await Task.findByIdAndDelete(id);
  } catch (error) {}
};
