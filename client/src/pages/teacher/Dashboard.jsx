import { useSelector } from 'react-redux'
import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { motion } from 'framer-motion'

const TeacherDashboard = () => {
  const { batches, assignments, students } = useSelector((state) => state.data)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeStudents = students.length // Mock
  const totalSubmissions = assignments.reduce((acc, assignment) => acc + (assignment.submissions?.length || 0), 0)
  const avgScore = assignments.reduce((acc, assignment) => acc + (assignment.avgScore || 0), 0) / assignments.length || 0

  const stats = [
    { 
      label: 'Total Batches', 
      value: batches.length, 
      color: 'text-primary-600 dark:text-primary-400', 
      bg: 'bg-primary-50 dark:bg-primary-900/20',
      icon: '👥',
      change: '+2 this month'
    },
    { 
      label: 'Active Students', 
      value: activeStudents, 
      color: 'text-green-600 dark:text-green-400', 
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: '👨‍🎓',
      change: '+12 this week'
    },
    { 
      label: 'Total Assignments', 
      value: assignments.length, 
      color: 'text-accent-600 dark:text-accent-400', 
      bg: 'bg-accent-50 dark:bg-accent-900/20',
      icon: '📝',
      change: '+5 this week'
    },
    { 
      label: 'Submissions', 
      value: totalSubmissions, 
      color: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: '📊',
      change: '+23 today'
    },
    { 
      label: 'Avg Score', 
      value: `${Math.round(avgScore)}%`, 
      color: 'text-purple-600 dark:text-purple-400', 
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: '⭐',
      change: '+3% this month'
    }
  ]

  const recentActivity = [
    {
      type: 'assignment',
      title: 'New assignment created',
      description: 'Math Quiz #3 - Due tomorrow',
      time: '2 hours ago',
      icon: '📝',
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
    },
    {
      type: 'submission',
      title: 'New submission received',
      description: 'John Doe submitted Science Project',
      time: '4 hours ago',
      icon: '📤',
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
    },
    {
      type: 'batch',
      title: 'Student added to batch',
      description: 'Sarah Wilson joined Batch A',
      time: '1 day ago',
      icon: '👥',
      color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    }
  ]

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Navbar />
      <Sidebar role="teacher" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
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
              Teacher Dashboard 📚
            </h1>
            <p className="text-lg text-secondary-600 dark:text-secondary-400">
              Manage your classes and track student progress.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${stat.bg} border-0`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl`}>
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-secondary-600 dark:text-secondary-400">
                        {stat.change}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card className="mb-8">
                <Card.Header>
                  <Card.Title>Quick Actions</Card.Title>
                  <Card.Description>Common tasks</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    <Button variant="primary" className="w-full justify-start" icon="📝">
                      Create Assignment
                    </Button>
                    <Button variant="secondary" className="w-full justify-start" icon="👥">
                      Manage Batches
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" icon="📊">
                      View Analytics
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" icon="🤖">
                      Generate with AI
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <Card.Header>
                  <Card.Title>Recent Activity</Card.Title>
                  <Card.Description>Latest updates from your classes</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl"
                      >
                        <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center`}>
                          <span className="text-lg">{activity.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-secondary-900 dark:text-secondary-100">
                            {activity.title}
                          </div>
                          <div className="text-sm text-secondary-600 dark:text-secondary-400">
                            {activity.description}
                          </div>
                        </div>
                        <div className="text-xs text-secondary-500 dark:text-secondary-400">
                          {activity.time}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <Card className="mt-8">
            <Card.Header>
              <Card.Title>Upcoming Deadlines</Card.Title>
              <Card.Description>Assignments due soon</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
                    </div>
                    <div>
                      <div className="font-medium text-secondary-900 dark:text-secondary-100">
                        Math Quiz #3
                      </div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400">
                        Due tomorrow • 15 students
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400">📅</span>
                    </div>
                    <div>
                      <div className="font-medium text-secondary-900 dark:text-secondary-100">
                        Science Project
                      </div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400">
                        Due in 3 days • 8 students
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

export default TeacherDashboard