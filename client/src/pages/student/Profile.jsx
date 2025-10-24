import { useSelector } from 'react-redux'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'

const StudentProfile = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="flex">
      <Navbar />
      <Sidebar role="student" />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <Card>
          <h2 className="text-2xl">Student Info</h2>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Role: Student</p>
          {/* Mock batch details */}
          <p>Batch: Batch 2025-A</p>
        </Card>
      </main>
    </div>
  )
}

export default StudentProfile