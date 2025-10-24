import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true, min: 0 }
});

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  questions: [questionSchema],
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;