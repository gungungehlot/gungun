import axios from 'axios';
import iziToast from 'izitoast';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Forgot() {

    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

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
    const forgotlink = (event) => {
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
        axios.put('http://localhost:5000/api/website/user/forgot-password',{
            email : event.target.email.value,
        })
            .then((result) => {
                iziToast.success({
                    message: result.data._message
                })

                navigate('/login') 
            })

    }
    return (
        <>
            <form onSubmit={forgotlink}>
                <div class="forgotprofile-card" >
                    <div class="container">
                        <div class="usercontainercard">
                            <h2>Forgot Password </h2>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name='email'
                            placeholder='Enter Email Address '
                            onKeyUp={ErrorHandler}
                            required
                        />
                        {
                            errors.includes("email") && (
                                <p className='error'>
                                    email is required
                                </p>
                            )}

                            <button className='updateprofile' type='submit'>Send Reset Link</button>
                        
                    </div>
                </div>
            </form>
        </>
    )
}