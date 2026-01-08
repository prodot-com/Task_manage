import prisma from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";

export const registerUser = async (req: any, res: any) => {
    // console.log("REQ BODY:", req.body, "EMAIL:", req.body?.email);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }


  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return res.status(201).json(
    new ApiResponse(201, { token }, "Registered")
  );
};

export const loginUser = async (req: any, res: any) => {
    
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return res.json(
    new ApiResponse(200, { token }, "Login success")
  );
};
