import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { BiUser } from 'react-icons/bi'
import { FaFileImage, FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { FcAddImage } from 'react-icons/fc'
import { PiImageSquare } from 'react-icons/pi'
import { FaUserCircle } from 'react-icons/fa'
import iziToast from 'izitoast'
import { RiDeleteBin3Fill } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/loginslice'

export default function Myprofile() {
    const [update, Setupdate] = useState([])
    const [profile, setProfile] = useState([])
    const [updateProfile, setUpdateProfile] = useState([])
    const [errors, setErrors] = useState([])
    const [selectimage, setselectimage] = useState('')
    const [gender, setGender] = useState('')
    const [activity, setActivity] = useState([])
    const [seletedrecords, Setselectedrecords] = useState([])
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const selectgender = (chngGender) => {
        setGender(chngGender)
    }

    const singlecheck = (id) => {
        // console.log(id)
        if (seletedrecords.includes(id)) {
            var finalresponse = seletedrecords.filter((v) => {
                if (v != id) {
                    return v
                }
            })
            Setselectedrecords(finalresponse)
        } else {
            var finalresponse = [...seletedrecords, id]
            Setselectedrecords(finalresponse)
        }

    }

    const Deleteactivity = () => {
        axios.put(`http://localhost:5000/api/admin/get/deleteactivity`, {
            id: seletedrecords
        }, { headers: { Authorization: `Bearer ${Cookies.get('admin_token')}` } })
            .then(() => {
                setActivity([])
            })
            .catch(() => {
                iziToast.error({
                    message: 'Something went wrong'
                })
            })
    }

    const handleChangePassword = (event) => {
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
        axios.put(`http://localhost:5000/api/admin/user/change-password`, event.target, { headers: { Authorization: `Bearer ${Cookies.get('admin_token')}` } })
            .then((result) => {
                if (result.data._status == true) {
                    event.target.reset();
                    iziToast.success({
                        message: result.data._message
                    })
                    Cookies.set("admin_token", result.data._token)
                    console.log(result.data._token)
                    navigate('/dashboard')
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
            axios.put(`http://localhost:5000/api/admin/user/update-profile`, event.target, { headers: { Authorization: `Bearer ${Cookies.get('admin_token')}` } })
                .then((result) => {
                    iziToast.success({
                        message: result.data._message
                    })
                    navigate('/dashboard')
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
        } else {
            let updated = errors.filter((v) => v !== fieldName);
            setErrors(updated);
        }

    }

    const handleimagechange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setselectimage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const Logoutadmin = () => {
        dispatch(logout())
        var cookies = Cookies.get('admin_token')
        if (cookies == '' || cookies == undefined) {
            iziToast.success({
                message: 'Sucess'
            })
            navigate('/')
        }
    }

    useEffect(() => {
        axios.put(`http://localhost:5000/api/admin/user/view-profile`, {}, { headers: { Authorization: `Bearer ${Cookies.get('admin_token')}` } })
            .then((result) => {
                setProfile(result.data._data);
                setGender(result.data._data.gender)
                console.log(result.data._data.name)
                setselectimage(result.data.image + '/' + result.data._data.image)
                console.log(result.data.image + '/' + result.data._data.image)
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])

    useEffect(() => {
        axios.post(`http://localhost:5000/api/admin/get/getactivity`, {}, { headers: { Authorization: `Bearer ${Cookies.get('admin_token')}` } })
            .then((result) => {
                setActivity(result.data._data)
                iziToast.success({
                    message: 'Your Recent Activities'
                })

            })
            .catch(() => {
                iziToast.error({
                    message: 'Something Went Wrong'
                })
            })
    }, [])




    return (
        <>

            <div class='userprofilemain'>
                <nav class="profile-navbar">
                    <div class="nav-left">
                        <img src='src\assets\images\profile.gif' />
                    </div>

                    <div class="nav-right">
                        <a href="#">Dashboard</a>
                        <a href="#" class="active">Profile</a>
                        <button className='logout' onClick={Logoutadmin}>Logout</button>
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

                                            {/* INPUT KO YAHI RAKH (circle ke andar) */}
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
                                    defaultValue={profile?.name}
                                    onKeyUp={ErrorHandler}
                                />
                            </div>

                            <div class="form-group">
                                <label>Email</label>
                                <input
                                    type='email'
                                    name='email'
                                    placeholder='Enter Admin Email '
                                    defaultValue={profile?.email}
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
                                    defaultValue={profile?.mobile_number}
                                    onKeyUp={ErrorHandler}
                                />
                            </div>

                            <div class="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name='address'
                                    placeholder='Enter Admin Address '
                                    defaultValue={profile?.address}
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
                    {/* Update -Password */}
                    {/* right section */}
                    <form onSubmit={handleChangePassword}>
                        <div class="profile-card" >

                            <div class="container">
                                <div class="usercontainercard">
                                    <h2>Change Password </h2>
                                </div>
                            </div>


                            <div class="form-group">
                                <label>Current Password</label>
                                <input
                                    type="number"
                                    name='Current_password'
                                    placeholder='Enter Admin Current Password '
                                    onKeyUp={ErrorHandler}
                                    required
                                />
                                {
                                    errors.includes("Current_password") && (
                                        <p className='error'>
                                            Current_password is required
                                        </p>
                                    )}
                            </div>

                            <div class="form-group">
                                <label>New Password</label>
                                <input type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    name='New_password'
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    showPassword
                                        ?
                                        <FaRegEye className="eyepassword"
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                        :
                                        <FaRegEyeSlash className="eyepassword"
                                            onClick={() => setShowPassword(!showPassword)} />
                                }

                                {
                                    errors.includes("New_password") && (
                                        <p className='error'>
                                            New_password is required
                                        </p>
                                    )}
                            </div>

                            <div class="form-group">
                                <label>Conform Password</label>
                                <input type='password'
                                    placeholder="Conform_password"
                                    name='Confrom_password'
                                    onKeyUp={ErrorHandler}
                                />


                                {
                                    errors.includes("Confrom_password") && (
                                        <p className='error'>
                                            Conform_password is required
                                        </p>
                                    )}
                            </div>

                            <button className='updateprofile'>Update Password</button>
                        </div>

                    </form>
                    <div className="activityBox">
                        <div className="activity-header">
                            <h3>Recent Activity</h3>
                            <button className="clear-btn" onClick={Deleteactivity}>Clear All <RiDeleteBin3Fill /></button>
                        </div>
                        {
                            activity?.map((value, index) => (
                                <div key={index} className="activityItem">
                                    <div className='selectbox'>
                                        <div>
                                            <p><b>{value.action}</b></p>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                onClick={() => singlecheck(value._id)}
                                                checked={seletedrecords.includes(value._id) ? true : false}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        {/* <p><b>{value.action}</b></p> */}
                                        <p>{value.details}</p>
                                        <small>
                                            {new Date(value.time).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </small>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
        </>
    )
}
