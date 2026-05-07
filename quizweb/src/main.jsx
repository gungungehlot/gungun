import { createRoot } from 'react-dom/client'
import '../src/assets/css/style.css'
import '../src/assets/css/responsive.css'
import Home from './components/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Service from './components/Service'
import Login from './components/Loginregister'
import Createquiz from './components/Createquiz'
import Profile from './components/Profile'
import Forgot from './components/Forgot'
import Playquiz from './components/Playquiz'
import Startquiz from './components/Startquiz'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Reser from './components/Reser'
import { Provider } from 'react-redux'
import { reduxStore } from '../redux/reduxtool'
import Myscore from './components/Myscore'

createRoot(document.getElementById('root')).render(
 <Provider store={reduxStore}>
<BrowserRouter>
<ToastContainer/>
<Routes>
  <Route path='/' element = {<Home/>} />
  <Route path ='/login' element = {<Login/>}/>
  <Route path ='/forgot' element = {<Forgot/>}/>
  <Route path ='/service' element = {<Service/>}/>
  <Route path = '/createquiz' element = {<Createquiz/>}/>
  <Route path = '/profile'  element = {<Profile/>}/>
  <Route path ='/Quiz/:id' element = {<Playquiz/>}/>
  <Route path = '/start/:id' element = {<Startquiz/>}/>
  <Route path = '/Reset/:token' element = {<Reser/>}/>
  <Route path='/score' element = {<Myscore/>}/>
</Routes>
</BrowserRouter>
</Provider>
)
