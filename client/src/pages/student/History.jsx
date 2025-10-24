import { useSelector } from 'react-redux'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'

const StudentHistory = () => {
  const submissions = useSelector((state) => state.data.submissions)
  // Mock history list
  const history = Object.values(submissions).flatMap(s => Object.values(s))

  return (
    <div className="flex">
      <Navbar />
      <Sidebar role="student" />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">History</h1>
        <div className="space-y-4">
          {history.map((sub, idx) => (
            <Card key={idx}>
              <p>Assignment Completed: {sub.completedAt}</p>
              <p>Score: {sub.score}%</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default StudentHistory