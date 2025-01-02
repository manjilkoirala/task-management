import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { IUser } from "../interfaces/user.interface";

export const authenticate = (
  req: Request & { user?: IUser }, // Augment the Request object to include a user property
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token is provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        status: "error",
        message: "Authentication token is missing or invalid",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
      return;
    }

    // Attach user data to the request object for use in controllers
    req.user = decoded; // Now this is valid due to the type augmentation

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Authentication failed",
    });
  }
};
