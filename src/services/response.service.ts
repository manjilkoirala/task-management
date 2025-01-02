import { Response } from "express";

class ResponseService {
  static success<T>(
    res: Response,
    message: string = "Success",
    data: T | null = null,
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      status: "success",
      message,
      data,
    });
  }

  static error(
    res: Response,
    message: string = "Something went wrong",
    error: any = null,
    statusCode: number = 500
  ): void {
    res.status(statusCode).json({
      status: "error",
      message,
      error: error ? error.message || error : null,
    });
  }
}

export default ResponseService;
