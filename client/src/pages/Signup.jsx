import { useState, useEffect } from 'react'  // <-- Added useEffect import
import { useDispatch } from 'react-redux'
import { signup } from '../store/authSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import Card from '../components/Card'

const Signup = () => {
  const [role, setRole] = useState('teacher')  // Default to teacher
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  // <-- NEW: useEffect to set role from URL params (if added later)
  useEffect(() => {
    const { search } = location
    const params = new URLSearchParams(search)
    const defaultRole = params.get('role') || 'teacher'
    setRole(defaultRole)
  }, [location.search])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock signup
    dispatch(signup({ id: Date.now(), name, email, role }))
    const path = role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-16">
      <Navbar />
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
              required
            />
          </div>
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        <p className="mt-4 text-center">
          Have account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </Card>
    </div>
  )
}

export default Signup