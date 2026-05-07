import axios from 'axios';
import iziToast from 'izitoast';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';


export default function Reset() {

     const [errors, setErrors] = useState('')
        const navigate = useNavigate();
        const params = useParams();
    
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
        const resetlink = (event) => {
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
            axios.put('http://localhost:5000/api/website/user/reset-password',event.target,{ headers: { Authorization: `Bearer ${params.token}` } })
                .then((result) => {
                    iziToast.success({
                        message: result.data._message
                    })
                    navigate('/') 
                })
                .catch(()=>{
                    iziToast.error({
                        message : 'Something went wrong'
                    })
                })
    
        }
  return (
    <>
     <form onSubmit={resetlink}>
                <div class="forgotprofile-card" >
                    <div class="container">
                        <div class="usercontainercard">
                            <h2>Reset Password </h2>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Enter New Password</label>
                        <input
                            type="password"
                            name='new_password'
                            placeholder='Enter New_password '
                            onKeyUp={ErrorHandler}
                            required
                        />
                        {
                            errors.includes("new_password") && (
                                <p className='error'>
                                    New_password is required
                                </p>
                            )}
                    </div>

                     <div class="form-group">
                        <label>Enter New Password</label>
                        <input
                            type="password"
                            name='confirm_password'
                            placeholder='Enter Conform_password '
                            onKeyUp={ErrorHandler}
                            required
                        />
                        {
                            errors.includes("confirm_password") && (
                                <p className='error'>
                                    Conform_password is required
                                </p>
                            )}
                    </div>

                    <button className='updateprofile' type='submit'>Send Reset Link</button>
                </div>
            </form> 
    </>
  )
}
