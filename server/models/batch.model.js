import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
  createdAt: { type: Date, default: Date.now }
});

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;