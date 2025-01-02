import { Request, Response, NextFunction } from "express";
import { IUser } from "../interfaces/user.interface";

export const authorizeAdmin = (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({
      status: "error",
      message: "Access denied. Admins only.",
    });
    return;
  }

  next(); // Proceed to the next middleware or route handler
};
