import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  postJob,
  listOpenJobs,
  getJobById,
  getAdminJobs,
} from "../controllers/job.controller.js";

const router = express.Router();

// create job (auth)
router.post("/create", isAuthenticated, postJob);

// public jobs feed (no auth)
router.get("/public", listOpenJobs);

// admin jobs list (auth)
router.get("/admin/list", isAuthenticated, getAdminJobs);

// job by id (no auth for students browsing)
router.get("/:id", getJobById);

export default router;
