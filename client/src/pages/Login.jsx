// ...existing code...
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/authSlice'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'
import { motion } from 'framer-motion'
import { signIn as apiSignIn } from '../apiCalls/authCall' // <-- NEW: API call
// ...existing code...

const Login = () => {
  const [role, setRole] = useState('teacher')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    const { search } = location
    const params = new URLSearchParams(search)
    const defaultRole = params.get('role') || 'teacher'
    setRole(defaultRole)
  }, [location.search])

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError(null)
  
  try {
    const data = await apiSignIn({ email, password })
    // Get role from backend response
    const user = data || { id: 1, name: 'User', email, role: 'student' }
    
    dispatch(login({
      user,
      role: user.role // Use role from backend
    }))

    // Redirect based on role from backend
    const path = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'
    navigate(path)
  } catch (err) {
    const msg = (err && (err.message || err.error || JSON.stringify(err))) || 'Sign in failed'
    setError(msg)
  } finally {
    setLoading(false)
  }
}

  const roleOptions = [
    {
      value: 'teacher',
      label: 'Teacher',
      description: 'Manage classes and assignments',
      icon: '👨‍🏫',
      color: 'from-blue-500 to-blue-600'
    },
    {
      value: 'student',
      label: 'Student',
      description: 'Access assignments and track progress',
      icon: '👨‍🎓',
      color: 'from-green-500 to-green-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      <Navbar />
      
      <main className="pt-20 flex items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                🎓
              </div>
              <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                Welcome Back
              </h1>
              <p className="text-secondary-600 dark:text-secondary-400">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRole(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        role === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.icon}</div>
                      <div className="font-semibold text-sm text-secondary-900 dark:text-secondary-100">
                        {option.label}
                      </div>
                      <div className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                        {option.description}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-secondary-600 dark:text-secondary-400">
                Don't have an account?{' '}
                <Link 
                  to={`/signup?role=${role}`} 
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl">
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                Demo Credentials
              </h3>
              <p className="text-xs text-secondary-600 dark:text-secondary-400">
                Use any email and password to sign in. This is a demo application.
              </p>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

export default Login
// ...existing code...