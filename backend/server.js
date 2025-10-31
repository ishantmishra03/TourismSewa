import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";

import authRouter from "./routes/auth/auth.routes.js";
import experienceRouter from "./routes/experiences.routes.js";
import businessRouter from "./routes/business.routes.js";

import { connectDB2 } from "./config/db.js";

await connectDB2();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("Server working...");
});

app.use("/api/auth", authRouter);
app.use("/api/experiences", experienceRouter);
app.use("/api/businesses", businessRouter);

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
