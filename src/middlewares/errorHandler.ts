import { Request, Response, NextFunction } from "express";

const errorHandler = (
  error: any,

  res: Response,
  next: NextFunction
) => {
  console.error(error.stack);

  // Fallback to status 500 if err.status is undefined or invalid
  const statusCode = error.status || 500;

  res.status(statusCode).json({
    status: "error",
    message: error.message || "An unexpected error occurred",
  });
};

export default errorHandler;
