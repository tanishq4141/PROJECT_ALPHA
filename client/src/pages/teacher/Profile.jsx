import { useSelector } from 'react-redux'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'

const TeacherProfile = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="flex">
      <Navbar />
      <Sidebar role="teacher" />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <Card>
          <h2 className="text-2xl">Teacher Info</h2>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Role: Teacher</p>
        </Card>
      </main>
    </div>
  )
}

export default TeacherProfile