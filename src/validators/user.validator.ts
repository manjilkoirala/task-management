import { body, param } from "express-validator";

export const registerUserValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/, "i")
    .withMessage(
      "Password must contain at least 1 number, 1 lowercase letter, 1 uppercase letter and 1 special character"
    ),
  body("role").notEmpty().withMessage("Role is required"),
];

export const loginUserValidator = [
  body("email").isEmail().withMessage("Email is invalid"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const getUserValidator = [
  param("id").notEmpty().withMessage("User id is required"),
];
