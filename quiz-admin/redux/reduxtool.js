import { configureStore } from '@reduxjs/toolkit'
import  loginSlice  from './loginslice'

export const reduxStore = configureStore({
  reducer: {
    admin_token:loginSlice
  },
})