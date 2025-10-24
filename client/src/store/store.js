import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import dataReducer from './dataSlice'
import { saveToLocalStorage, loadFromLocalStorage } from './localStorageMiddleware'

// Optional: Load initial data from localStorage on app start
const preloadedState = loadFromLocalStorage()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      const result = next(action)
      saveToLocalStorage(store.getState())
      return result
    }),
})