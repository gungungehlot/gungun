import React, { useState } from 'react'
import '../assets/css/login.css'
import { FaLock, FaUser } from 'react-icons/fa'
import { IoMail } from 'react-icons/io5'
import axios from 'axios'
import iziToast from 'izitoast'
import { Link, useNavigate } from 'react-router-dom'

import Cookies from 'js-cookie'
export default function Login() {
  const [login, setLogin] = useState(false)
  const [active, setActive] = useState(true)
  const [register, setRegister] = useState(true)
  const [errors, setErrors] = useState(true)
  const navigate = useNavigate()

  const handleLogin = async (event) => {
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
    if (arrayerror.length == 0) {
      axios.post(`http://localhost:5000/api/website/user/login`, event.target)
        .then((result) => {
          if (result.data._status == true) {
            event.target.reset();
            iziToast.success({
              message: result.data._message
            })
             Cookies.set("user_token",result.data._token)
            navigate('/')
          } else {
            iziToast.error({
              message: result.data._message
            })
          }
        })
        .catch(() => {
          iziToast.error({
            message: 'Something went wrong'
          })
        })
    }
  }
  const handleRegister = async (event) => {
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
    if (arrayerror.length == 0) {
      axios.post(`http://localhost:5000/api/website/user/register`, event.target)
        .then((result) => {
          if (result.data._status == true) {
            event.target.reset();
            iziToast.success({
              message: result.data._message
            })
             setActive(!active)
          } 
          else {
            iziToast.error({
              message: result.data._message
            })
          }
        })
        .catch(() => {
          iziToast.error({
            message: 'Something went wrong'
          })
        })
    }
  }
  let ErrorHandler = (event) => {
    let fieldName = event.target.name;
    if (event.target.value === "") {
      if (!errors.includes(fieldName)) {
        setErrors([...errors, fieldName]);
      }
      console.log(errors)
    } else {
      let updated = errors.filter((v) => v !== fieldName);
      setErrors(updated);
    }
  }
  return (
    <>
      {/* form outer bases */}
      <div className='outterform'>
        <div className={`${active ? 'conatiner' : 'active conatiner'}`}>
          {/*  login form  */}
          <div className="form-box login " >
            <form action='#' onSubmit={handleLogin}>
              <h3>Login</h3>
              <div className="input-box">
                {/* input for username */}
                <input
                  type='text'
                  placeholder='Email'
                  name='email'
                  onKeyUp={ErrorHandler}
                  required
                />
                <FaUser className='loginicons' />
              </div>
              {/* input for password */}
              <div className="input-box">
                <input
                  type='password'
                  name='password'
                  onKeyUp={ErrorHandler}
                  placeholder='Password'
                  required
                />
                <FaLock className='loginicons' />
              </div>
              <div className="forgot-link">
                  <Link to={`/forgot`} >
                  Forgot Password?
                  </Link>
              </div>
              <button
                type='submit'
                className='btns'
                // onClick={() => setActive(!active)}
              >
                Login
              </button>
            </form>
          </div>
          {/* form box register */}
          <div className="form-box regitser" >
            <form action='#' onSubmit={handleRegister}>
              <h3>Register</h3>
              <div className="input-box">
                {/* input for username */}
                <input
                  type='text'
                  onKeyUp={ErrorHandler}
                  placeholder='username'
                  name='name'
                  required
                />
                <FaUser className='loginicons' />
              </div>
              <div className="input-box">
                {/* input for username */}
                <input
                  type='text'
                  placeholder='Email'
                  onKeyUp={ErrorHandler}
                  name='email'
                  required
                />
                <IoMail className='loginicons' />
              </div>
              {/* input for password */}
              <div className="input-box">
                <input
                  type='password'
                  placeholder='Password'
                  onKeyUp={ErrorHandler}
                  name='password'
                  required
                />
                <FaLock className='loginicons' />
              </div>
              <button
                className='btns'
                type='submit'
              >
                Register
              </button>
            </form>
          </div>
          {/* toggle box */}
          <div className="toggle-box">
            {/* toggle box left */}
            <div className="toggle-panel toggle-left">
              <h3>Hello, Welcome!</h3>
              <p>Dont have an account?</p>
              <button
                className={`${register ? 'btns register-btn' : ' active btns register-btn'}`}
                onClick={() => setActive(!active)}
              >Register</button>
            </div>
            {/* toggle box right */}
            <div className="toggle-panel toggle-right">
              <h3>Welcome back!</h3>
              <p>Already have an account?</p>
              <button

                className={`${login ? 'btns login-btn' : ' active btns login-btn'}`}
                onClick={() => setActive(!active)}
              >
                Login</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

