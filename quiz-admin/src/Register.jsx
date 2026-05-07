import axios from 'axios'
import iziToast from 'izitoast'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { CiUsb, CiUser } from 'react-icons/ci'
import { FaLock, FaUser } from 'react-icons/fa'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { IoMail } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
const [errors , setErrors] = useState([]) 
const [ showPassword ,setShowPassword] = useState(false)



 const navigate = useNavigate();
const formhandler = (event) => {
        event.preventDefault();
        var data = event.target;
        var field = data.querySelectorAll('input')
        var arrayerror = [];

        field.forEach((item) => {
            if (item.name != 'image') {
                if (!item.value.trim()) {
                    arrayerror.push(item.name)
                }
            }
        })
        arrayerror = ([... new Set(arrayerror)])
        setErrors(arrayerror)
        if(arrayerror.length == 0){   
          axios.post(`http://localhost:5000/api/admin/user/register`,{
          name : event.target.name.value,
          password : event.target.password.value,
          email:event.target.email.value 
        })
   .then((result)=>{
    if(result.data._status == true){
       event.target.reset();
      iziToast.success({
        message  : result.data._message
      })
      navigate('/')
    }else{
     iziToast.error({
        message  : result.data._message
      }) 
    }
  })
  .catch(()=>{
    iziToast.error({
      message: 'something went wrong'
    })
  })
  }
}
// Error Handler Function
  let ErrorHandler = (event) => {
        let fieldName = event.target.name;
        if (event.target.value === "") {
            if (!errors.includes(fieldName)) {
                setErrors([...errors, fieldName]);
            }
        } else {
            let updated = errors.filter((v) => v !== fieldName);
            setErrors(updated);
        }
    }
  return (
    <>
     <div className="login">
        <div className="loginbackgorund">
            <div className="loginheading">
            <h1>Register <CiUser/></h1>
            </div>
        
        {/* input mobile */}
        <form onSubmit={formhandler}>
        <div className="input">
            <FaUser className="icon"/>
            <input type="text"
            placeholder="Name"
            onKeyUp={ErrorHandler}
            name ='name'/>
             {
                  errors.includes("name")&&(
                    <p className='error'>
                      name is required
                    </p>
                  )}
        </div>
        {/* input name */}
          <div className="input">
            <IoMail className="icon"/>
            <input type="text"
             placeholder="Email"  
             onKeyUp={ErrorHandler}
             name = 'email'/>
             {
                  errors.includes("email")&&(
                    <p className='error'>
                      email is required
                    </p>
                  )}
        </div>
        {/* input password */}
        <div className="input">
            
            <input type={showPassword ? 'text' : 'password'} 
            placeholder="Password" 
            onKeyUp={ErrorHandler}
            name='password'
             />
              {
                                     showPassword
                                       ?
                                       <FaRegEye className="eye"
                                         onClick={() => setShowPassword(!showPassword)}
                                       />
                                       :
                                       <FaRegEyeSlash className="eye"
                                         onClick={() => setShowPassword(!showPassword)} />
                                   }
              {
                  errors.includes("password")&&(
                    <p className='error'>
                      password is required
                    </p>
                  )}
        </div>
        <button className="loginbtn">
          Register
          </button>
           </form>
        <p className="register">
             have an account?
           <Link className="anchor" to={'/'}>
           Login
             </Link>  
         </p> 
        </div>
    </div> 
    </>
  )
}
