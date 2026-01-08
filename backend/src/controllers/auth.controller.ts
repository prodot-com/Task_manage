import { Request, Response } from "express";
import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";

const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password)

    if (!name || !email || !password) {
      return res.status(400).json(new ApiResponse(400, null, "Name, email, and password are required"));
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(new ApiResponse(400, null, "Please provide a valid email address"));
    }

    if (password.length < 6) {
      return res.status(400).json(new ApiResponse(400, null, "Password must be at least 6 characters long"));
    }


    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(409).json(new ApiResponse(409, null, "An account with this email already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
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
      new ApiResponse(201, { token, user: { id: user.id, name: user.name, email: user.email } }, "Registration successful")
    );

  } catch (error) {
    console.error("REGISTRATION_ERROR:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error during registration"));
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)

    if (!email || !password) {
      return res.status(400).json(new ApiResponse(400, null, "Email and password are required"));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json(new ApiResponse(401, null, "Invalid email or password"));
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
      new ApiResponse(200, { token, user: { id: user.id, name: user.name, email: user.email } }, "Login successful")
    );

  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error during login"));
  }
};