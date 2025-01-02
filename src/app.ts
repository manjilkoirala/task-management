import express from "express";
import { userRouter } from "./routes/user.route";
import errorHandler from "./middlewares/errorHandler";
import { taskRouter } from "./routes/task.route";
import { authenticate } from "./middlewares/auth";

const app = express();

app.use(
  express.json({
    limit: "20kb",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", authenticate, taskRouter); // Apply authentication middleware before taskRouter

// Global error handler
app.use(errorHandler);

export default app;
