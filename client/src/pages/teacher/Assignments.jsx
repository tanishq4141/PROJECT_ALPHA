import { useSelector, useDispatch } from 'react-redux'
import { createAssignment } from '../../store/dataSlice'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import AssignmentCard from '../../components/AssignmentCard'
import Button from '../../components/Button'
import Card from '../../components/Card'

const TeacherAssignments = () => {
  const dispatch = useDispatch()
  const assignments = useSelector((state) => state.data.assignments)

  const handleCreateAssignment = () => {
    const title = prompt('Assignment Title:')
    const type = prompt('Type (MCQ/Fill/Short):')
    const batchId = parseInt(prompt('Batch ID:'))
    if (title && type && batchId) {
      dispatch(createAssignment({ title, type, batchId, questions: [] }))
    }
  }

  return (
    <div className="flex">
      <Navbar />
      <Sidebar role="teacher" />
      <main className="ml-64 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Assignments</h1>
          <Button onClick={handleCreateAssignment}>Create Assignment</Button>
        </div>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} role="teacher" />
          ))}
        </div>
      </main>
    </div>
  )
}

export default TeacherAssignments