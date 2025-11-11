import express from "express";
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();


router.post("/register", isAuthenticated, registerCompany);


router.get("/get", isAuthenticated, getCompany);


router.get("/get/:id", isAuthenticated, getCompanyById);


router.put("/update/:id", isAuthenticated, upload.single("file"), updateCompany);

export default router;
