import Batch from "../models/batch.model.js";
import User from "../models/user.model.js";

export const createBatch = async (req, res) => {
  try {
    const { name, description, studentEmails = [] } = req.body;
    
    // Validate teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create batches' });
    }

    // Find students by emails
    const students = await User.find({ 
      email: { $in: studentEmails },
      role: 'student'
    });

    const studentIds = students.map(student => student._id);

    const batch = await Batch.create({
      name,
      description,
      teacher: req.user._id,
      students: studentIds
    });

    // Add batch reference to students
    await User.updateMany(
      { _id: { $in: studentIds } },
      { $push: { batches: batch._id } }
    );

    // Populate student details
    const populatedBatch = await Batch.findById(batch._id)
      .populate('students', 'name email')
      .populate('teacher', 'name email');

    res.status(201).json(populatedBatch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find({ teacher: req.user._id })
      .populate('students', 'name email')
      .populate('teacher', 'name email');
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};