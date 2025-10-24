import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated: false,
  user: null,
  role: null, // 'teacher' or 'student'
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.role = action.payload.role
    },
    signup: (state, action) => {
      state.isAuthenticated = true
      state.user = action.payload
      state.role = action.payload.role
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.role = null
    },
  },
})

export const { login, signup, logout } = authSlice.actions
export default authSlice.reducer