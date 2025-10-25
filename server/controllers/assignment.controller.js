import Assignment from "../models/assignment.model.js";
import Batch from "../models/batch.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Create assignment and optionally assign to batch immediately
export const createAssignment = async (req, res) => {
  try {
    const { title, description, questions, dueDate, batchId } = req.body;
    if (!title || !description || !questions || !dueDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      questions,
      dueDate,
      teacher: req.user._id,
      batch: batchId || null
    });

    // add to teacher createdAssignments
    await User.findByIdAndUpdate(req.user._id, { $push: { createdAssignments: assignment._id } });

    // if batchId provided, link assignment -> batch and add assignment to each student
    if (batchId && mongoose.Types.ObjectId.isValid(batchId)) {
      const batch = await Batch.findById(batchId).select("students assignments");
      if (!batch) {
        return res.status(404).json({ message: "Batch not found" });
      }
      // add to batch.assignments
      batch.assignments.push(assignment._id);
      await batch.save();

      // push assignment ref to every student in that batch (status defaults to pending)
      if (batch.students && batch.students.length) {
        await User.updateMany(
          { _id: { $in: batch.students } },
          { $push: { assignments: { assignment: assignment._id } } }
        );
      }
    }

    return res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Assign existing assignment to students or to a batch
export const assignAssignment = async (req, res) => {
  try {
    const { assignmentId, studentIds = [], batchId } = req.body;
    if (!assignmentId) return res.status(400).json({ message: "assignmentId required" });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // If batchId provided -> add to batch and all its students
    if (batchId) {
      const batch = await Batch.findById(batchId).select("students assignments");
      if (!batch) return res.status(404).json({ message: "Batch not found" });

      // Avoid duplicate insertion in batch.assignments
      if (!batch.assignments.some(id => id.equals(assignment._id))) {
        batch.assignments.push(assignment._id);
        await batch.save();
      }

      if (batch.students && batch.students.length) {
        await User.updateMany(
          { _id: { $in: batch.students } },
          { $addToSet: { assignments: { assignment: assignment._id } } }
        );
      }
    }

    // If explicit studentIds provided -> assign to them
    if (Array.isArray(studentIds) && studentIds.length) {
      await User.updateMany(
        { _id: { $in: studentIds } },
        { $addToSet: { assignments: { assignment: assignment._id } } }
      );
    }

    return res.status(200).json({ message: "Assigned successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get assignments for a student (populate assignment data)
export const getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(studentId)) return res.status(400).json({ message: "Invalid id" });

    // ensure only same student or teacher can fetch? For now allow only the student themselves or teacher
    if (req.user.role === "student" && req.user._id.toString() !== studentId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await User.findById(studentId).populate({
      path: "assignments.assignment",
      model: "Assignment"
    });

    if (!student) return res.status(404).json({ message: "Student not found" });

    return res.status(200).json({ assignments: student.assignments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get assignments created by a teacher
export const getTeacherAssignments = async (req, res) => {
  try {
    const teacherId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(teacherId)) return res.status(400).json({ message: "Invalid id" });

    const assignments = await Assignment.find({ teacher: teacherId }).sort({ createdAt: -1 });
    return res.status(200).json({ assignments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// New: student submits answers for an assignment
export const submitAssignment = async (req, res) => {
  try {
    const studentId = req.user?._id;
    const { assignmentId, answers } = req.body;

    if (!studentId) return res.status(401).json({ message: "Not authenticated" });
    if (!assignmentId || !Array.isArray(answers)) return res.status(400).json({ message: "assignmentId and answers array required" });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Only students can submit
    if (req.user.role !== "student") return res.status(403).json({ message: "Only students can submit assignments" });

    // Score calculation
    const total = assignment.questions.length || 0;
    let correct = 0;
    for (let i = 0; i < total; i++) {
      const q = assignment.questions[i];
      const provided = typeof answers[i] === "number" ? answers[i] : Number(answers[i]);
      if (q && provided === q.correctOption) correct++;
    }
    const scorePercent = total === 0 ? 0 : Math.round((correct / total) * 100);

    // Update user's assignments array (mark completed & set score). If not present, add it.
    const user = await User.findById(studentId);
    if (!user) return res.status(404).json({ message: "Student not found" });

    const existing = user.assignments.find(a => String(a.assignment) === String(assignmentId));
    if (existing) {
      existing.status = "completed";
      existing.score = scorePercent;
    } else {
      user.assignments.push({
        assignment: assignment._id,
        status: "completed",
        score: scorePercent
      });
    }
    await user.save();

    // Optionally add to assignment.submissions or keep as-is. Return result.
    return res.status(200).json({
      message: "Submitted",
      score: scorePercent,
      totalQuestions: total,
      correctAnswers: correct,
      assignmentId
    });
  } catch (err) {
    console.error("submitAssignment error:", err);
    return res.status(500).json({ message: "Server error while submitting assignment" });
  }
};