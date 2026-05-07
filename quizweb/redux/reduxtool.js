import { configureStore } from '@reduxjs/toolkit'
import  loginSlice  from './loginslice'

export const reduxStore = configureStore({
  reducer: {
    user_token:loginSlice
  },
})