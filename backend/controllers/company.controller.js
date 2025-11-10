import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res, next) => {
  try {
    console.log("--- New Company Registration Attempt ---");
    console.log("1. Request Body:", req.body);
    console.log("2. Request ID (from auth):", req.id);

    const { name } = req.body;
    if (!name) {

      console.log("3. Validation FAILED: Company name is missing.");
      return res.status(400).json({ success: false, message: "Company name is required" });
    }

    const existing = await Company.findOne({ name });
    if (existing) {
      console.log("3. Validation FAILED: Company already exists.");
      return res.status(400).json({ success: false, message: "Company already exists" });
    }

    const company = await Company.create({ name, userId: req.id });

    console.log("3. SUCCESS: Company created.");
    return res.status(201).json({ success: true, message: "Company registered successfully", company });
    
  } catch (err) {
    console.error("3. REGISTRATION CATCH BLOCK ERROR:", err);
    return next(err);
  }
};


export const getCompany = async (req, res, next) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });
    return res.status(200).json({ success: true, companies });
  } catch (err) {
    return next(err);
  }
};


export const getCompanyById = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    if (!mongoose.isValidObjectId(companyId)) {
      return res.status(400).json({ success: false, message: "Invalid company id" });
    }
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    return res.status(200).json({ success: true, company });
  } catch (err) {
    return next(err);
  }
};
export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid company id" });
    }

    const allowed = ["name", "description", "website", "location"];
    const updateData = {};
    for (const k of allowed) if (req.body?.[k]) updateData[k] = req.body[k];

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const uploaded = await cloudinary.uploader.upload(fileUri.content);
      updateData.logo = uploaded.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    const company = await Company.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Company information updated",
      company,
    });
  } catch (err) {
    return next(err);
  }
};
