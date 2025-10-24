import { useSelector, useDispatch } from 'react-redux'
import { createBatch } from '../../store/dataSlice'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import BatchCard from '../../components/BatchCard'
import Button from '../../components/Button'
import Card from '../../components/Card'

const TeacherBatches = () => {
  const dispatch = useDispatch()
  const batches = useSelector((state) => state.data.batches)

  const handleCreateBatch = () => {
    const name = prompt('Batch Name:')
    const description = prompt('Description:')
    if (name && description) {
      dispatch(createBatch({ name, description, students: [] }))
    }
  }

  return (
    <div className="flex">
      <Navbar />
      <Sidebar role="teacher" />
      <main className="ml-64 p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Batches</h1>
          <Button onClick={handleCreateBatch}>Create Batch</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <BatchCard key={batch.id} batch={batch} role="teacher" />
          ))}
        </div>
      </main>
    </div>
  )
}

export default TeacherBatches