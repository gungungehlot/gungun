import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../Sidebar'
import iziToast from 'izitoast'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import Cookies from 'js-cookie'

export default function Createadmin() {
  const [update, Setupdate] = useState('')
  const [selectimage, setselectimage] = useState('')
  const [admindetail, Setadmindetail] = useState('')
  const [errors, setErrors] = useState([])
  const [showPassword, setShowPassword] = useState(false)


  const params = useParams();
  const navigate = useNavigate();



  // Detail api

  useEffect(() => {
    if (params.id != '' && params.id != undefined) {
      axios.put(`http://localhost:5000/api/admin/user/details/${params.id}`)
        .then((result) => {
          if (result.data._status == true) {
            Setadmindetail(result.data._data)
            setselectimage(result.data.image + '/' + result.data._data.image)
            Setupdate(result.data._data._id)
            console.log(result.data._data._id)
          }
        })
        .catch(() => {
          iziToast.error({
            message: 'Something Went Wrong'
          })
        })
    }
  }, [params])

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
    console.log(arrayerror)
    if (arrayerror.length == 0) {

      if (update == '') {
        axios.post(`http://localhost:5000/api/admin/user/create`, event.target, { headers: { Authorization: `Bearer ${Cookies.get('admin_token')}` } })
          .then((result) => {
            if (result.data._status == true) {
              iziToast.success({
                message: result.data._mesage
              })
              navigate('/usermangement/admin')
            } else {
              iziToast.error({
                message: result.data._mesage
              })
            }
          })
          .catch(() => {
            iziToast.error({
              message: 'Something went wrong'
            })
          })
      } else {
        axios.put(`http://localhost:5000/api/admin/user/update/${update}`, event.target)
          .then((result) => {
            if (result.data._status == true) {
              iziToast.success({
                mesage: result.data._message
              })
              navigate('/usermangement/admin')
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
      <div class='usermain'>
        <Sidebar />
        <div class='  userdetail'>
          <div className="usernav">
            <ul className="userlink">
              <Link to={`/dashboard`}>
                <li>
                  Dashboard
                </li>
              </Link>
              <li>
                /
              </li>
              <Link to={`/usermangement/admin`}>
                <li>
                  Admin
                </li>
              </Link>
              <li>
                /
              </li>
              <li>
                {
                  update
                    ?
                    'Update Admin'
                    :
                    'Create Admin'
                }
              </li>
            </ul>
          </div>
          <div className='faqouter'>
            <h1>Admin </h1>
          </div>
          <hr />
          <form onSubmit={formhandler} autoComplete='off'>
            <div className='faqinner'>

              <h5>
                {
                  update
                    ?
                    'Update Admin-Data'
                    :
                    'Create Admin-Data'
                }
              </h5>
              <div className='faqlabel'>
                <label>
                  Enter Admin Name
                </label>
              </div>
              <div className='faqinput'>
                <input
                  name='name'
                  placeholder='Enter Admin Name '
                  defaultValue={admindetail.name}
                  onKeyUp={ErrorHandler}
                />
                {
                  errors.includes("name") && (
                    <p className='error'>
                      name is required
                    </p>
                  )}
              </div>
              {
                update
                  ?
                  ''
                  :
                  <>
                    <div className='faqlabel'>
                      <label>
                        Enter Admin Email
                      </label>
                    </div>
                    <div className='faqinput' >
                      <input
                        name='email'
                        placeholder='Enter Admin Email '
                        defaultValue={admindetail.email}
                        onKeyUp={ErrorHandler}
                      />
                      {
                        errors.includes("email") && (
                          <p className='error'>
                            Email is required
                          </p>
                        )}
                    </div>
                  </>
              }
              {
                update
                  ?
                  ''
                  :
                  <>
                    <div className='faqlabel'>
                      <label>
                        Enter Admin password
                      </label>
                    </div>
                    <div className='faqinput'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        placeholder='Enter Admin Password '
                        defaultValue={admindetail.password}
                        onKeyUp={ErrorHandler}
                      />
                      {
                        showPassword
                          ?
                          <FaRegEye className="eyeadmin"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                          :
                          <FaRegEyeSlash className="eyeadmin"
                            onClick={() => setShowPassword(!showPassword)} />
                      }
                      {
                        errors.includes("password") && (
                          <p className='error'>
                            password is required
                          </p>
                        )}
                    </div>
                  </>
              }
              <div className='faqlabel'>
                <label>
                  Enter Admin mobile_number
                </label>
              </div>
              <div className='faqinput'>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  name="mobile_number"
                  placeholder="Enter Admin Mobile Number"
                  defaultValue={admindetail.mobile_number}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  }}
                  onKeyUp={ErrorHandler}
                />
                {
                  errors.includes("mobile_number") && (
                    <p className='error'>
                      mobile_number is required
                    </p>
                  )}
              </div>
              <div className='faqlabel'>
                <label>
                  Enter Admin Address
                </label>
              </div>
              <div className='faqinput'>
                <input
                  name='address'
                  placeholder='Enter Admin Address '
                  defaultValue={admindetail.address}
                  onKeyUp={ErrorHandler}
                />
                {
                  errors.includes("address") && (
                    <p className='error'>
                      address is required
                    </p>
                  )}
              </div>
              <div class="gender-box">
                <h5>Select Gender</h5>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" name="gender" value="male" />
                    Male
                  </label>

                  <label class="radio-item">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      onSelect={ErrorHandler} />
                    Female
                  </label>
                  {
                    errors.includes("gender") && (
                      <p className='error'>
                        Gender is required
                      </p>
                    )}
                </div>
              </div>

              <button type='submit'>
                {
                  update
                    ?
                    'Update Admin'
                    :
                    'Create Admin'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
