import express from "express";
import {
  createAssignment,
  assignAssignment,
  getStudentAssignments,
  getTeacherAssignments
} from "../controllers/assignment.controller.js";
import { authenticate, requireTeacher } from "../middleware/auth.middleware.js";

const router = express.Router();

// Teacher creates assignment (can optionally include batchId to auto-assign)
router.post("/create", authenticate, requireTeacher, createAssignment);

// Teacher assigns an existing assignment to student(s) or batch
router.post("/assign", authenticate, requireTeacher, assignAssignment);

// Student or authorized user gets student assignments
router.get("/student/:id", authenticate, getStudentAssignments);

// Get assignments created by teacher
router.get("/teacher/:id", authenticate, getTeacherAssignments);

export default router;