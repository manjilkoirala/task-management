import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import ResponseService from '../services/response.service';
import { comparePassword, hashPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { uploadImage } from '../services/cloudinary.service';
import { sendEmail } from '../services/email.service';

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return ResponseService.error(res, 'User not found', null, 404);

    // Check if password is correct
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return ResponseService.error(res, 'Invalid password', null, 401);
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return ResponseService.success(res, 'Login successful', { token, user });
  } catch (error) {
    next(error);
  }
};

//register user

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseService.error(res, 'User already exists', null, 409);
    }

    //image upload
    const profilePicLocalPath = req?.file?.path;
    if (!profilePicLocalPath) {
      return ResponseService.error(
        res,
        'Profile picture is required',
        null,
        400,
      );
    }

    //upload image to cloudinary
    const uploadedImage = await uploadImage(profilePicLocalPath);

    // Hash password
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePic: uploadedImage?.secure_url,
    });

    // Send welcome email
    await sendEmail({
      email: email,
      subject: `Welcome to our Task Management `,
      message: `Welcome to our Task Management by Manjil Koirala. We are happy to have you here ${name}. Your role is ${role}.`,
    })
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        ResponseService.error(res, 'Error sending email', error, 500);
      });

    return ResponseService.success(res, 'Signup successful', newUser, 201);
  } catch (error) {
    next(error);
  }
};

//get all users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find();
    return ResponseService.success(res, 'All users', users);
  } catch (error) {
    next(error);
  }
};

//get user by id
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return ResponseService.error(res, 'User not found', null, 404);
    return ResponseService.success(res, 'User found', user);
  } catch (error) {
    next(error);
  }
};
