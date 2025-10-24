import { useSelector } from 'react-redux'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import AssignmentCard from '../../components/AssignmentCard'

const StudentAssignments = () => {
  const assignments = useSelector((state) => state.data.assignments)

  return (
    <div className="flex">
      <Navbar />
      <Sidebar role="student" />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Assignments</h1>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} role="student" />
          ))}
        </div>
      </main>
    </div>
  )
}

export default StudentAssignments