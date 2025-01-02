import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskbyId,
  getTasks,
  updateTask,
} from "../controllers/task.controller";
import {
  createTaskValidator,
  deleteTaskValidator,
  getTaskValidator,
  updateTaskValidator,
} from "../validators/task.validator";

const router = Router();

//user routes
router.post("/", createTaskValidator, createTask);
router.get("/", getTasks);
router.get("/:id", getTaskValidator, getTaskbyId);
router.patch("/:id", updateTaskValidator, updateTask);
router.delete("/:id", deleteTaskValidator, deleteTask);

export { router as taskRouter };
