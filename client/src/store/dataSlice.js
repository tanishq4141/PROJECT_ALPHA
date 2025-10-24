import { createSlice } from '@reduxjs/toolkit'
import batchesData from '../data/batches.json'
import studentsData from '../data/students.json'
import assignmentsData from '../data/assignments.json'

const initialState = {
  batches: batchesData,
  students: studentsData,
  assignments: assignmentsData,
  submissions: {}, // { assignmentId: { studentId: { submission, score } } }
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    createBatch: (state, action) => {
      const newBatch = { id: Date.now(), ...action.payload }
      state.batches.push(newBatch)
    },
    addStudentToBatch: (state, action) => {
      const { batchId, studentId } = action.payload
      const batch = state.batches.find(b => b.id === batchId)
      if (batch && !batch.students.includes(studentId)) {
        batch.students.push(studentId)
      }
    },
    createAssignment: (state, action) => {
      const newAssignment = { id: Date.now(), ...action.payload }
      state.assignments.push(newAssignment)
    },
    submitAssignment: (state, action) => {
      const { assignmentId, studentId, submission, score } = action.payload
      if (!state.submissions[assignmentId]) state.submissions[assignmentId] = {}
      state.submissions[assignmentId][studentId] = { submission, score, completedAt: new Date().toISOString() }
    },
    // Add more reducers as needed (e.g., updateBatch, deleteAssignment)
  },
})

export const { createBatch, addStudentToBatch, createAssignment, submitAssignment } = dataSlice.actions
export default dataSlice.reducer