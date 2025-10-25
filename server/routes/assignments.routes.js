import express from "express";
import {
  createAssignment,
  assignAssignment,
  getStudentAssignments,
  getTeacherAssignments,
  submitAssignment
} from "../controllers/assignment.controller.js";
import { authenticate, requireTeacher } from "../middleware/auth.middleware.js";

const router = express.Router();

// Teacher creates assignment (can optionally include batchId to auto-assign)
router.post("/create",  requireTeacher, createAssignment);

// Teacher assigns an existing assignment to student(s) or batch
router.post("/assign",  requireTeacher, assignAssignment);

// Student submits answers
router.post("/submit",  submitAssignment);

// Student or authorized user gets student assignments
router.get("/student/:id",  getStudentAssignments);

// Get assignments created by teacher
router.get("/teacher/:id",  getTeacherAssignments);

export default router;