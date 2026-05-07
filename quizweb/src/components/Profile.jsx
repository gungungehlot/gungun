import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import iziToast from 'izitoast'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/loginslice'

export default function Profile() {
  const [update, Setupdate] = useState([])
    const [profile, setProfile] = useState([])
    const [updateProfile, setUpdateProfile] = useState([])
    const [errors, setErrors] = useState([])
    const [selectimage, setselectimage] = useState('')
    const [gender, setGender] = useState('')

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const selectgender = (chngGender) => {
        setGender(chngGender)
    }
    const handleChangePassword = (event) =>{
     event.preventDefault();

        var data = event.target;
        var field = data.querySelectorAll('input ')
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
        axios.put(`http://localhost:5000/api/website/user/changepassword`,event.target,{ headers: { Authorization: `Bearer ${Cookies.get('user_token')}` } }) 
        .then((result) => {
                if (result.data._status == true) {
                    event.target.reset();
                    iziToast.success({
                        message: result.data._message
                    })
                    Cookies.set("user_token", result.data._token)
                    console.log(result.data._token)
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
     const formhandler = (event) => {
        event.preventDefault();

        var data = event.target;
        var field = data.querySelectorAll('input ')
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
          axios.put(`http://localhost:5000/api/website/user/updateprofile`,event.target,{ headers: { Authorization: `Bearer ${Cookies.get('user_token')}` } })
          .then((result)=>{
            iziToast.success({
              message : result.data._message
            })
            navigate('/')
          })
          .catch(()=>{
            iziToast.error({
              message : 'Something went wrong'
            })
          })
        }
      }
      
    const Logoutadmin =()=>{
        dispatch(logout())
        var cookies=Cookies.get('user_token') 
        if(cookies == '' || cookies == undefined){
            iziToast.success({
                message : 'Sucess'
            })
                navigate('/login')
        }
    }
    var cookies=Cookies.get('user_token') 
     if(cookies == '' || cookies == undefined){
            iziToast.error({
                message : 'Please login first'
            })
                navigate('/login')
        }
  useEffect(()=>{
    axios.put(`http://localhost:5000/api/website/user/viewprofile`,{},{ headers: { Authorization: `Bearer ${Cookies.get('user_token')}` } })
    .then((result)=>{
      setProfile(result.data._data)
      console.log(result.data._data)
       setselectimage(result.data.image + '/' + result.data._data.image)
       setGender(result.data._data)
    })
    // .catch(()=>{
    //   iziToast.error({
    //     message : 'Something went wrong'
    //   })
    // })
  },[])

  
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

    const handleimagechange = (event) => {
        const file = event.target.files[0];
        console.log(file)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setselectimage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
  return (
      <>
            <div class='userprofilemain'>
                <nav class="profile-navbar">
                    <div class="nav-left">
                        <img src = 'src\assets\images\profile.webp'/>
                    </div>
                    <div class="nav-right">
                        <a href="#">Dashboard</a>
                        <a href="#" class="active">Profile</a>
                        <button className='logout-btn' onClick={Logoutadmin}>Logout</button>
                    </div>
                </nav>
                <div className='mainprofile'>
                    {/* view profile */}
                    <form onSubmit={formhandler}>
                        <div class="profile-card" >

                            <div class="container">
                                <div class="usercontainercard">
                                    <h2>User Image </h2>
                                </div>
                                <div className='userinnercard'>

                                    <div className='useroutterimage'>
                                        <div className='userinnerimage'>

                                            {!selectimage ? (
                                                <p className='userinnerimageheading'>
                                                    <span>Click to upload</span> or drag and drop
                                                </p>
                                            ) : (
                                                <img
                                                    src={selectimage}
                                                    alt="Selected"
                                                    className="profileimageselect "
                                                />
                                            )}

                                           
                                            <input
                                                type="file"
                                                name='image'
                                                onChange={handleimagechange}
                                                className='imageinput'
                                            />

                                        </div>
                                    </div>

                                </div>
                            </div>


                            <div class="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name='name'
                                    placeholder='Enter Admin Name '
                                    defaultValue={profile.name}
                                    onKeyUp={ErrorHandler}
                                />
                            </div>

                            <div class="form-group">
                                <label>Email</label>
                                <input
                                    type='email'
                                    name='email'
                                    placeholder='Enter Admin Email '
                                    defaultValue={profile.email}
                                    onKeyUp={ErrorHandler}
                                />
                            </div>

                            <div class="form-group">
                                <label>Mobile Number</label>
                                <input
                                    type="number"
                                    maxLength={10}
                                    name='mobile_number'
                                    placeholder='Enter Admin mobile_number '
                                    defaultValue={profile.mobile_number}
                                    onKeyUp={ErrorHandler}
                                />
                            </div>

                            <div class="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name='address'
                                    placeholder='Enter Admin Address '
                                    defaultValue={profile.address}
                                    onKeyUp={ErrorHandler}
                                />
                            </div>

                            <div class="form-group">
                                <label>Gender</label>
                                <div class="gender">
                                    <label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={gender == 'male'}
                                            onChange={() => selectgender('male')}
                                            onSelect={ErrorHandler} />
                                        Male
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={gender == 'female'}
                                            onChange={() => selectgender('female')}
                                            onSelect={ErrorHandler} />
                                        female
                                    </label>
                                </div>
                            </div>

                            <button className='updateprofile'>Update Profile</button>
                        </div>

                    </form>
                    {/* right section */}
                    <form  onSubmit={ handleChangePassword}>
                        <div class="profile-card" >

                            <div class="container">
                                <div class="usercontainercard">
                                    <h2>Change Password</h2>
                                </div>
                            </div>


                            <div class="form-group">
                                <label>Current Password</label>
                                <input
                                    type="text"
                                    name='Current_password'
                                    placeholder='Enter Current Password'
                                    onKeyUp={ErrorHandler}
                                />
                            </div>

                            <div class="form-group">
                                <label>New Password</label>
                                <input
                                    type='text'
                                    name='New_password'
                                    placeholder='Enter New_password '
                                    onKeyUp={ErrorHandler}
                                />
                            </div>
                            <div class="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name='Conform_password'
                                    placeholder='Enter Conform_password '
                                    onKeyUp={ErrorHandler}
                                />
                            </div>

                            

                            <button className='updateprofile'>Change</button>
                        </div>

                    </form>
                </div>

            </div>
        </>
  )
}
