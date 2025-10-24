import { useDispatch } from 'react-redux'
import { addStudentToBatch, createBatch } from '../store/dataSlice'
import Button from './Button'
import Card from './Card'

const BatchCard = ({ batch, role }) => {
  const dispatch = useDispatch()

  if (role === 'student') return null // Students don't manage batches

  return (
    <Card className="mb-4">
      <h3 className="text-lg font-bold">{batch.name}</h3>
      <p>{batch.description}</p>
      <p>Students: {batch.students.length}</p>
      <Button onClick={() => {
        const studentEmail = prompt('Add student email:')
        // Mock find student by email
        dispatch(addStudentToBatch({ batchId: batch.id, studentId: 3 })) // Example
      }}>
        Add Student
      </Button>
    </Card>
  )
}

export default BatchCard