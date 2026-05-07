import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { CiAlarmOff } from 'react-icons/ci'
import { PiUsersBold } from 'react-icons/pi'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import { MdQuiz } from 'react-icons/md'
import { BiSolidCategory } from 'react-icons/bi'
import { useEffect } from 'react'
import axios from 'axios'
import iziToast from 'izitoast'
import { FaUser } from 'react-icons/fa'
import { RiAdminFill } from 'react-icons/ri'
import Cookies from 'js-cookie'
import { useNavigate, useNavigation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

export default function Admindashboard() {
  const [Category ,SetCategory] = useState([])
  const [profile,setProfile] = useState('')
  const [admin , setadmin] = useState([])

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // topic api
  useEffect(()=>{
    axios.post(`http://localhost:5000/api/admin/topic/view`)
    .then((result)=>{
      if(result.data._status == true){
        SetCategory(result.data._data)
      }else{
        SetCategory([])
      }
    })
    .catch(()=>{
      iziToast.error({
        message : 'Something went wrong'
      })
    })
  },[])
  useEffect(()=>{
     axios.put(`http://localhost:5000/api/admin/user/view-profile`,{},{headers:{Authorization:`Bearer ${Cookies.get('admin_token')}`}})
     .then((result) => {
      if(result.data._status == true){
        setProfile(result.data._data)
      }
      })
      .catch((err) => {
        console.log(err);
      });
  },[])
  // admin view api
  useEffect(()=>{
   axios.post(`http://localhost:5000/api/admin/user/view`) 
   .then((result)=>{
      if(result.data._status == true){
        setadmin(result.data._data)
        console.log(result.data._data)
      }else{
        setadmin([])
      }
    })
    .catch(()=>{
      iziToast.error({
        message : 'Something went wrong'
      })
    })
  },[])
  return (
    <>
    <div class='usermain'>
              <Sidebar/>
    <div class='  userdetail'>
      <h3>  Welcome back , {profile ? profile.name : "Admin"}   <FaUser/></h3>
      <p>Here’s what’s happening with your platform today.</p>
      <div className='dashboardcard'>
        <div className='dashboardcards'>
           {/* <div className='commom'> */} 
          <div className='cardsui'>
            <div className='common'>
              <div className='cardicon'>
              <PiUsersBold/>
            </div>
            <div className='cardtext'>
              10+
            </div>
            </div>
            <div className='cardspantext'>
            <span>Total users</span>
            </div>
          </div>
        </div>
          <div className='dashboardcards'>
          <div className='cardsui'>
            <div className='common'>
              <div className='cardicon'>
              <BiSolidCategory/>
            </div>
            <div className='cardtext'>
              {Category.length}
            </div>
            </div>
            <div className='cardspantext'>
            <span>Total Categories</span>
            </div>
          </div>
        </div>
        <div className='dashboardcards'>
          <div className='cardsui'>
            <div className='common'>
              <div className='cardicon'>
              <MdQuiz/>
            </div>
            <div className='cardtext'>
              10+
            </div>
            </div>
            <div className='cardspantext'>
            <span>Total Quizzes</span>
            </div>
          </div>
        </div>
          <div className='dashboardcards'>
          <div className='cardsui'>
            <div className='common'>
              <div className='cardicon'>
              <RiAdminFill/>
            </div>
            <div className='cardtext'>
             {admin.length}
            </div>
            </div>
            <div className='cardspantext'>
            <span>Total Admins</span>
            </div>
          </div>
        </div>
        </div>
    </div>
    </div>            
    </>
  )
}

