import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherBatches from './pages/teacher/Batches'
import TeacherAssignments from './pages/teacher/Assignments'
import TeacherProfile from './pages/teacher/Profile'
import StudentDashboard from './pages/student/Dashboard'
import StudentAssignments from './pages/student/Assignments'
import StudentHistory from './pages/student/History'
import StudentProfile from './pages/student/Profile'

function App() {
  const { isAuthenticated, role } = useSelector((state) => state.auth)

  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />
    return children
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/batches"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherBatches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assignments"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentAssignments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/history"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRole="student"> 
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App