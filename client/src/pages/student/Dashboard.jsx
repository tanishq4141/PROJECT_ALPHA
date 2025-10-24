import { useSelector } from 'react-redux'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import AssignmentCard from '../../components/AssignmentCard'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { motion } from 'framer-motion'

const StudentDashboard = () => {
  const assignments = useSelector((state) => state.data.assignments)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pending = assignments.filter(a => !a.completed) // Mock filter
  const completed = assignments.filter(a => a.completed) // Mock filter

  const stats = [
    { label: 'Pending Assignments', value: pending.length, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Completed', value: completed.length, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Assignments', value: assignments.length, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Average Score', value: '85%', color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-50 dark:bg-accent-900/20' }
  ]

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Navbar />
      <Sidebar role="student" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 p-3 bg-white dark:bg-secondary-800 rounded-xl shadow-medium"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <main className="lg:ml-80 pt-20 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-secondary-900 dark:text-secondary-100 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-lg text-secondary-600 dark:text-secondary-400">
              Here's what's happening with your assignments today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${stat.bg} border-0`}>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      {stat.label}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <Card.Header>
              <Card.Title>Quick Actions</Card.Title>
              <Card.Description>Get things done faster</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon="📝">
                  Start New Assignment
                </Button>
                <Button variant="secondary" icon="📊">
                  View Progress
                </Button>
                <Button variant="ghost" icon="📚">
                  Browse Resources
                </Button>
                <Button variant="ghost" icon="💬">
                  Ask for Help
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Pending Assignments */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-semibold text-secondary-900 dark:text-secondary-100">
                Pending Assignments
              </h2>
              <Button variant="ghost" size="sm" icon="🔍">
                Filter
              </Button>
            </div>
            
            {pending.length > 0 ? (
              <div className="space-y-4">
                {pending.map((assignment, index) => (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AssignmentCard assignment={assignment} role="student" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                    All caught up!
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    You have no pending assignments. Great job!
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Recent Activity */}
          <Card>
            <Card.Header>
              <Card.Title>Recent Activity</Card.Title>
              <Card.Description>Your latest submissions and feedback</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-secondary-900 dark:text-secondary-100">
                      Math Assignment #3
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      Submitted 2 hours ago • Score: 95%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400">📝</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-secondary-900 dark:text-secondary-100">
                      Science Project
                    </div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">
                      Due in 3 days • 75% complete
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

export default StudentDashboard