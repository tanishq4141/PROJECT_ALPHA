import { useSelector, useDispatch } from 'react-redux'
import { submitAssignment } from '../store/dataSlice'
import Button from './Button'
import Card from './Card'
import { motion } from 'framer-motion'

const AssignmentCard = ({ assignment, role }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const submissions = useSelector((state) => state.data.submissions)

  const handleSubmit = (submission) => {
    dispatch(submitAssignment({
      assignmentId: assignment.id,
      studentId: user.id,
      submission,
      score: Math.floor(Math.random() * 100) // Mock score
    }))
  }

  const getStatusInfo = (assignment) => {
    const dueDate = new Date(assignment.dueDate || Date.now() + 7 * 24 * 60 * 60 * 1000)
    const now = new Date()
    const isOverdue = now > dueDate
    const isDueSoon = (dueDate - now) < 24 * 60 * 60 * 1000 && !isOverdue
    
    if (isOverdue) return { status: 'overdue', text: 'Overdue', class: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 px-3 py-1 rounded-lg text-sm' }
    if (isDueSoon) return { status: 'due-soon', text: 'Due Soon', class: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-lg text-sm' }
    return { status: 'pending', text: 'Pending', class: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-lg text-sm' }
  }

  if (role === 'teacher') {
    const statusInfo = getStatusInfo(assignment)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card interactive className="mb-6">
          <Card.Header>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Card.Title>{assignment.title}</Card.Title>
                <Card.Description>{assignment.type} • Batch {assignment.batchId}</Card.Description>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
                {statusInfo.text}
              </span>
            </div>
          </Card.Header>
          
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {assignment.students?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {assignment.submissions?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Submissions</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {assignment.avgScore || 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
              </div>
            </div>
          </Card.Content>
          
          <Card.Footer>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="primary" 
                size="sm"
                icon="🤖"
                onClick={() => alert('Generate with Gemini AI (placeholder)')}
              >
                Generate Questions
              </Button>
              <Button variant="secondary" size="sm" icon="👁️">
                View Details
              </Button>
              <Button variant="ghost" size="sm" icon="📊">
                Analytics
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </motion.div>
    )
  }

  const submission = submissions[assignment.id]?.[user.id]
  const statusInfo = getStatusInfo(assignment)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card interactive className="mb-6">
        <Card.Header>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Card.Title>{assignment.title}</Card.Title>
              <Card.Description>{assignment.type}</Card.Description>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
              {statusInfo.text}
            </span>
          </div>
        </Card.Header>
        
        <Card.Content>
          {submission ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div>
                  <div className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Completed
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {submission.score}%
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Score</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  Due: {new Date(assignment.dueDate || Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </Card.Content>
        
        <Card.Footer>
          {submission ? (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon="👁️">
                View Submission
              </Button>
              <Button variant="ghost" size="sm" icon="📊">
                View Feedback
              </Button>
            </div>
          ) : (
            <Button 
              variant="primary" 
              size="sm" 
              icon="📝"
              onClick={() => handleSubmit('Mock submission')}
            >
              Submit Assignment
            </Button>
          )}
        </Card.Footer>
      </Card>
    </motion.div>
  )
}

export default AssignmentCard