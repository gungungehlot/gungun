import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Login'
import '../src/css/style.css'
import '../src/css/responsive.css'

import Register from './Register'
import Admindashboard from './components/Admindashboard'
import Addfaq from './components/Faq/Addfaq'
import Viewfaq from './components/Faq/Viewfaq'
import Viewtestimonial from './components/Testimonial/Viewtestimonial'
import Addtestimonial from './components/Testimonial/Addtestimonial'
import Addtopic from './components/Topics/Addtopic'
import Viewtopic from './components/Topics/Viewtopic'
import User from './components/Usermangement/User'
import Addquiz from './components/Quiz/Addquiz'
import Viewquiz from './components/Quiz/Viewquiz'
import Admin from './components/Usermangement/Admin'
import Createadmin from './components/Usermangement/Createadmin'
import UserDetails from './components/Usermangement/Userdeatils'
import Myprofile from './components/Myprofile'
import Forgot from './components/Usermangement/Forgot'
import Reset from './components/Usermangement/Reset'
import { Provider } from 'react-redux'
import { reduxStore } from '../redux/reduxtool'



createRoot(document.getElementById('root')).render(
   <Provider store={reduxStore}>
  <BrowserRouter>
  <Routes>
    <Route path = '/' element = {<Login/>} />
    <Route path ='/forgot' element = {<Forgot/>}/>
    <Route path ='/register' element = {<Register/>}/>
    <Route path= '/Reset/:token' element = {<Reset/>}/>
    <Route path = '/dashboard' element = {<Admindashboard/>}/>
    {/* <Route path = '/dashboard' element = {<Sidebar/>}/> */}
    <Route path = 'usermangement'>
      <Route path = 'user' element = {<User/>}/>
      <Route path ='admin' element = {<Admin/>}/>
      <Route path='admin'>
      <Route path ='createadmin' element = {<Createadmin/>} />
      <Route path = 'update/:id' element = {<Createadmin/>}/>
        </Route>

        <Route path='user'>
          <Route path = 'update/:id' element = {<UserDetails/>} />
        </Route>
    </Route>
     <Route path='/profile' element = {<Myprofile/>} />
    <Route path = 'faq'>
    <Route path = 'add' element={<Addfaq/>}/>
    <Route path='view' element = {<Viewfaq/>}/> 
    <Route path= 'update/:id' element = {<Addfaq/>}/>
    </Route>
    <Route path='testimonial'>
      <Route path = 'add' element = {<Addtestimonial/>}/>
      <Route path = 'view' element = {<Viewtestimonial/>}/>
      <Route path = 'update/:id' element = {<Addtestimonial/>}/>
    </Route>
    <Route path ='topic'>
      <Route path = 'add' element = {<Addtopic/>}/>
      <Route path = 'view' element = {<Viewtopic/>}/>
      <Route path ='update/:id' element = {<Addtopic/>}/>
    </Route>
    <Route path = 'quiz'>
      <Route path = 'add' element = {<Addquiz/>} />
      <Route path = 'view' element = {<Viewquiz/>}/>
      <Route path = 'update/:id' element = {<Addquiz/>}/>
    </Route>
  </Routes>
  </BrowserRouter>
   </Provider>
)

