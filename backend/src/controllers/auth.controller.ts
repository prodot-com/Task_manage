// import prisma from "../prisma.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import ApiResponse from "../utils/ApiResponse.js";

// export const registerUser = async (req: any, res: any) => {
//     // console.log("REQ BODY:", req.body, "EMAIL:", req.body?.email);

//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "All fields required" });
//   }


//   const exists = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (exists) {
//     return res.status(409).json({ message: "User already exists" });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await prisma.user.create({
//     data: {
//       name,
//       email,
//       password: hashedPassword,
//     },
//   });

//   const token = jwt.sign(
//     { userId: user.id },
//     process.env.JWT_SECRET!,
//     { expiresIn: "1h" }
//   );

//   return res.status(201).json(
//     new ApiResponse(201, { token }, "Registered")
//   );
// };

// export const loginUser = async (req: any, res: any) => {
    
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password required" });
//   }

//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const valid = await bcrypt.compare(password, user.password);

//   if (!valid) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     { userId: user.id },
//     process.env.JWT_SECRET!,
//     { expiresIn: "1h" }
//   );

//   return res.json(
//     new ApiResponse(200, { token }, "Login success")
//   );
// };


import { Request, Response } from "express";
import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";

// Validation helper for email format (optional but recommended)
const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password)

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json(new ApiResponse(400, null, "Name, email, and password are required"));
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(new ApiResponse(400, null, "Please provide a valid email address"));
    }

    if (password.length < 6) {
      return res.status(400).json(new ApiResponse(400, null, "Password must be at least 6 characters long"));
    }

    // 2. Check if user already exists
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(409).json(new ApiResponse(409, null, "An account with this email already exists"));
    }

    // 3. Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 4. Generate Token
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

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json(new ApiResponse(400, null, "Email and password are required"));
    }

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Use generic message for security (don't reveal if email exists)
      return res.status(401).json(new ApiResponse(401, null, "Invalid email or password"));
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json(new ApiResponse(401, null, "Invalid email or password"));
    }

    // 4. Generate Token
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