import { Request, Response } from "express";
import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";


export const registerUser = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    // console.log(userName, password)

    if (!userName || !password) {
      return res.status(400).json(new ApiResponse(400, null, "Username and password are required"));
    }

    if (password.length < 6) {
      return res.status(400).json(new ApiResponse(400, null, "Password must be at least 6 characters long"));
    }


    const exists = await prisma.user.findUnique({
      where: { userName },
    });

    if (exists) {
      return res.status(409).json(new ApiResponse(409, null, "An account with this username already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        userName,
        password: hashedPassword,
      },
    });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: "1h" }
    );
    console.log("Registration success")
    return res.status(201).json(
      new ApiResponse(201, { token, user: { id: user.id, username: user.userName } }, "Registration successful")
    );

  } catch (error) {
    console.error("REGISTRATION_ERROR:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error during registration"));
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    // console.log(userName, password)

    if (!userName || !password) {
      return res.status(400).json(new ApiResponse(400, null, "Email and password are required"));
    }

    const user = await prisma.user.findUnique({
      where: { userName },
    });

    if (!user) {
      return res.status(401).json(new ApiResponse(401, null, "Invalid username or password"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json(new ApiResponse(401, null, "Invalid email or password"));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: "1h" }
    );

    console.log("Login success")

    return res.status(200).json(
      new ApiResponse(200, { token, user: { id: user.id, username: user.userName } }, "Login successful")
    );

  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error during login"));
  }
};