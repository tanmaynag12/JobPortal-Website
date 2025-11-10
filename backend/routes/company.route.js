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

// create
router.post("/register", isAuthenticated, registerCompany);

// list by user
router.get("/get", isAuthenticated, getCompany);

// get by id
router.get("/get/:id", isAuthenticated, getCompanyById);

// update with optional logo file field "logo"
router.put("/update/:id", isAuthenticated, upload.single("logo"), updateCompany);

export default router;
