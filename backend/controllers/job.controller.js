import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

/** POST /api/v1/job/create (auth) */
export const postJob = async (req, res, next) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
    const userId = req.id;

    const missing =
      !title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId;
    
    if (missing) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const job = await Job.create({
      title,
      description,

      requirements: Array.isArray(requirements)
        ? requirements
        : String(requirements).split(",").map(s => s.trim()).filter(Boolean),
      

      salary: salary,
      
      location,
      jobType,
      
 
      experienceLevel: experience, 
      
      position: Number(position), 
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({ success: true, message: "New job created successfully", job });
  
  } catch (err) {

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: messages[0] });
    }
    
  
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/** GET /api/v1/job/public (no auth) */
export const listOpenJobs = async (req, res, next) => {
  try {
    const keyword = (req.query.keyword || "").trim();
    const filter = {
      ...(keyword && {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      }),
    };

    const jobs = await Job.find(filter)
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, jobs });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/job/:id (student) */
export const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid job id" });
    }

    const job = await Job.findById(id).populate({ path: "applications" });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    return res.status(200).json({ success: true, job });
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/job/admin/list (auth) */
export const getAdminJobs = async (req, res, next) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId })
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, jobs });
  } catch (err) {
    next(err);
  }
};