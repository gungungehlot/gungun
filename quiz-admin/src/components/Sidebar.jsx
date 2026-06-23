import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { BiUser } from 'react-icons/bi'
import { FaQuoteLeft, FaRegCircleUp, FaRegCircleUser, FaUserGear, FaUsers } from 'react-icons/fa6'
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowUp, IoMdAddCircleOutline } from 'react-icons/io'
import { IoAdd } from 'react-icons/io5'
import { MdOutlineTopic, MdQuiz, MdRateReview, MdSpaceDashboard } from 'react-icons/md'
import { RiAdminLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { CgProfile } from 'react-icons/cg'

export default function Sidebar() {
  const [open , setopen] = useState(false)
  const [quizopen , Setquizopen] = useState(false)
  const [Useropen , Setuseropen] = useState(true)
  const [opencategory , Setopencategory] = useState(false)
  const [faqopen , Setfaqopen] =  useState(false)
  const [profile , setProfile] = useState('')

   useEffect(()=>{
       axios.put(`http://localhost:5000/api/admin/user/view-profile`,{},{headers:{Authorization:`Bearer ${Cookies.get('admin_token')}`}})
       .then((result) => {
          setProfile(result.data._data);
        })
        .catch((err) => {
          console.log(err);
        });
    },[])
  return (
    <>
     <div className='admin'>
                 <div className='adminheading'>
                QuizUp Admin Panel   
            </div>
            <div className='adminuser'>
                <div className='usericon'>
                  <Link to={'/profile'}>
                  <CgProfile className='profleicon'/>
                  </Link>
                    <div>
                    {profile ? profile.name : 'Hi, Admin'} 
                    </div>
                </div>
                <p>{profile ? profile.email : 'adminquizup@gmail.com'}</p>
            </div>
            </div>
     <div className='sidebarouter'>
        <div className='sidebarinner'>
           <div className='dashboardouter'>
          <Link to={`/dashboard`}>
         <div className='Dashboardheading'>
           <div>
         <MdSpaceDashboard/>
          </div>
          <div>
            Dashboard 
          </div>
        </div>
         </Link>
        </div>    
        <div className='lists'>
        <ul>
           <li className='buttonlists'>
             <button
          className='dashbutton' 
          onClick={()=>Setuseropen(!Useropen)}
          >
          <FaUserGear  className='dashicon'/>  Accounts
            {
              Useropen
              ?
                <IoIosArrowDown className='dashicon' /> 
              :
                <IoIosArrowForward className='dashicon'/>
            }
            </button>
              {Useropen&&(
              <div className="addview">
                <Link to={`/usermangement/user`} >
                <h6 >Users <FaUsers /></h6>
                </Link>
                  <Link to={`/usermangement/admin`} >
                <h6>Admins <RiAdminLine /></h6>
                </Link>
              </div>
            )} 
        </li> 
         <li className='buttonlists'>
             <button
          className='dashbutton' 
          onClick={()=>Setquizopen(!quizopen)}
          >
           <MdQuiz className='dashicon' /> Quizes
            {
              quizopen
              ?
                <IoIosArrowDown className='dashicon' /> 
              :
                <IoIosArrowForward className='dashicon'/>
            }
            </button>
              {quizopen&&(
              <div className="addview">
                <Link to={`/quiz/add`} >
                <h6>Add  </h6>
                </Link>
                  <Link to={`/quiz/view`} >
                <h6>View</h6>
                </Link>
              </div>
            )} 
        </li>
        <li>
           <button
          className='dashbutton' 
          onClick={()=>Setopencategory(!opencategory)}
          >
          <MdOutlineTopic className='dashicon'/> Quizes-Topic
            {
              opencategory
              ?
                <IoIosArrowDown className='dashicon' /> 
              :
                <IoIosArrowForward className='dashicon'/>
            }
            </button>
            {opencategory&&(
              <div className="addview">
                <Link to={`/topic/add`} >
                <h6>Add</h6>
                </Link>
                  <Link to={`/topic/view`} >
                <h6>View</h6>
                </Link>
              </div>
            )}
        </li>
              <li>
           <button
          className='dashbutton' 
          onClick={()=>Setfaqopen(!faqopen)}
          >
          <FaQuoteLeft className='dashicon' /> Faqs
            {
              faqopen
              ?
                <IoIosArrowDown className='dashicon' /> 
              :
                <IoIosArrowForward className='dashicon'/>
            }

            </button>
            {faqopen&&(
              <div className="addview">
                <Link to={`/faq/add`} >
                <h6>Add</h6>
                </Link>
                  <Link to={`/faq/view`} >
                <h6>View</h6>
                </Link>
              </div>
            )}
        </li>
              <li>
           <button
          className='dashbutton' 
          onClick={()=>setopen(!open)}
          >
            
         <MdRateReview  className='dashicon' />  Testimonial
          {
              open
              ?
                <IoIosArrowDown className='dashicon' /> 
              :
                <IoIosArrowForward className='dashicon'/>
            }
            </button>
            {open&&(
              <div className="addview">
                <Link to={`/testimonial/add`} >
                <h6>Add</h6>
                </Link>
                  <Link to={`/testimonial/view`} >
                <h6>View</h6>
                </Link>
              </div>
            )}
        </li>
        </ul>
        </div>
        </div>  
    </div> 

    </>
  )
}
