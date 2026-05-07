import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'


var isLogin=Cookies.get('user_token');
isLogin=isLogin ? 1:0;

const initialState = {
  value: isLogin,
}

export const loginSlice = createSlice({
  name: 'user_token',
  initialState,
  reducers: {
    login: (state,action) => {
        state.value=(action.payload)
    },
    logout: (state) => {
        state.value=''
        console.log("hii")
        Cookies.remove('user_token')
    },
  },
})

export const { login, logout } = loginSlice.actions

export default loginSlice.reducer