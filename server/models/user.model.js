import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['teacher', 'student'],
    required: true
  },
  // New fields for batch management
  batches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  }],
  // For students: track assigned & completed assignments
  assignments: [{
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment'
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  // For teachers: track created assignments
  createdAssignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);
export default User;