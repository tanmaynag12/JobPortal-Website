import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config({});

const app = express();

// proper __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8000"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 8000;

// APIs
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// serve built frontend from ../frontend/dist
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "frontend", "dist");

if (fs.existsSync(path.join(DIST, "index.html"))) {
  app.use(express.static(DIST));
  app.get("*", (req, res) => {
    res.sendFile(path.join(DIST, "index.html"));
  });
} else {
  console.log("dist not found. run build in frontend");
}

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
