import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const Sidebar = ({ role, isOpen, onClose }) => {
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const navItems = role === 'teacher' 
    ? [
        { path: '/teacher/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/teacher/batches', label: 'Batches', icon: '👥' },
        { path: '/teacher/assignments', label: 'Assignments', icon: '📝' },
        { path: '/teacher/profile', label: 'Profile', icon: '👤' }
      ]
    : [
        { path: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/student/assignments', label: 'Assignments', icon: '📝' },
        { path: '/student/history', label: 'History', icon: '📊' },
        { path: '/student/profile', label: 'Profile', icon: '👤' }
      ]

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-gray-100">
          {role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {role === 'teacher' ? 'Manage your classes' : 'Track your progress'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  onClick={() => isMobile && onClose && onClose()}
                  className={`flex items-center px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600' : ''}`}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Project Alpha v1.0
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        
        {/* Mobile Sidebar */}
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: isOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg z-50 lg:hidden"
        >
          {sidebarContent}
        </motion.aside>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <aside className="hidden lg:block w-80 bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 shadow-lg z-30">
      {sidebarContent}
    </aside>
  )
}

export default Sidebar