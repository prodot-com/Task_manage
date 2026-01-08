import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import authRoutes from "./routes/auth.routes.js";
import authRoutes from "./routes/auth.routes.js"
import taskRoutes from "./routes/tasks.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (_, res) => {
  res.send("API is running");
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
