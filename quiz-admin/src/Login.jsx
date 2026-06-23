import axios from "axios";
import iziToast from "izitoast";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { login } from "../redux/loginslice.js";

export default function Login() {
    const [errors , setErrors] = useState([]) 
    const [showPassword , setShowPassword] = useState(false)
    

    const dispatch = useDispatch()

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
            axios.post(`http://localhost:5000/api/admin/user/login`,event.target)
    .then((result)=>{
    if(result.data._status == true){
       event.target.reset();
       dispatch(login(result.data._token))
      iziToast.success({
        message  : result.data._message
      })
      Cookies.set("admin_token",result.data._token)
      console.log(result.data._token)
      navigate('/dashboard')
    }else{
        iziToast.error({
            message : result.data._message
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
            <h1>Login <CiUser/></h1>
            </div>
        
        {/* input username */}
        <form onSubmit={formhandler}>

        <div className="input">
            <FaUser className="icon"/>
            <input type="text"
             placeholder="Email" 
             name = 'email'
             autoComplete="off"
             onKeyUp={ErrorHandler}
             />
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
             name = 'password'
             onKeyUp={ErrorHandler}
              />
               {
                showPassword
                ?
                 <FaRegEye className="eye" 
                  onClick={()=>setShowPassword(!showPassword)}
                />
                 :
                <FaRegEyeSlash className="eye" 
                  onClick={()=>setShowPassword(!showPassword)} />
               }
               
               {
                  errors.includes("password")&&(
                    <p className='error'>
                      password is required
                    </p>
                  )}
        </div>
        {/* remember forgot button */}
        <div className="remember">
            <label >
            <input type = 'checkbox'/>
            Remember me
            </label>
            <Link className="anchor" to={`/forgot`}>
           Forgot Password?
            </Link>
        </div>
         <button className="loginbtn">
        Login
        </button>
        </form>
        <p className="register">
            Don't have an account?
            <Link className="anchor" to={`/register`}>
            Register
            </Link>
           
        </p>
        </div>
    </div> 
    </>
  )
}
