import Batch from "../models/batch.model.js";
import User from "../models/user.model.js";

/** escape regex helper */
const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * POST /api/batches/create
 * Body: { name, description, studentEmails: [email1, email2, ...] }
 * Requirements: req.user must be teacher (middleware requireTeacher should enforce)
 */
export const createBatch = async (req, res) => {
  try {
    const { name, description = "", studentEmails = [] } = req.body;

    if (!name) return res.status(400).json({ message: "Batch name is required" });
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role !== "teacher") return res.status(403).json({ message: "Only teachers can create batches" });

    // Normalize incoming emails and remove empties
    const emails = Array.isArray(studentEmails)
      ? studentEmails.map(e => String(e).trim()).filter(Boolean)
      : String(studentEmails || "").split(",").map(e => e.trim()).filter(Boolean);

    // If there are emails, perform case-insensitive match
    let students = [];
    if (emails.length) {
      const orQueries = emails.map(e => ({ email: new RegExp(`^${escapeRegex(e)}$`, "i") }));
      students = await User.find({ role: "student", $or: orQueries }).select("_id email name");
    }

    const foundEmails = students.map(s => s.email.toLowerCase());
    const missingEmails = emails.filter(e => !foundEmails.includes(e.toLowerCase()));

    // Create batch
    const batch = await Batch.create({
      name,
      description,
      teacher: req.user._id,
      students: students.map(s => s._id),
    });

    // Update students' batches array (avoid duplicates)
    let updateResult = null;
    if (students.length) {
      updateResult = await User.updateMany(
        { _id: { $in: students.map(s => s._id) } },
        { $addToSet: { batches: batch._id } }
      );
    }

    // Populate for response
    const populated = await Batch.findById(batch._id)
      .populate("students", "name email")
      .populate("teacher", "name email");

    console.log("createBatch:", {
      teacher: req.user._id.toString(),
      requestedEmails: emails,
      foundCount: students.length,
      missingEmails,
      updateResult
    });

    return res.status(201).json({
      batch: populated,
      foundCount: students.length,
      missingEmails,
      updateResult
    });
  } catch (err) {
    console.error("createBatch error:", err);
    return res.status(500).json({ message: "Server error while creating batch" });
  }
};

export const getBatches = async (req, res) => {
  try {
    const teacherId = req.user?._id;
    if (!teacherId) return res.status(401).json({ message: "Not authenticated" });

    const batches = await Batch.find({ teacher: teacherId })
      .populate("students", "name email")
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ batches });
  } catch (err) {
    console.error("getBatches error:", err);
    return res.status(500).json({ message: "Server error while fetching batches" });
  }
};