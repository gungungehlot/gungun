import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaFileImage } from 'react-icons/fa'
import axios from 'axios'
import iziToast from 'izitoast'

export default function Userdeatils() {
  const [update , Setupdate ] = useState('')
  const [selectimage ,setselectimage] = useState('')
  const [userdetail , Setuserdetail] = useState('')
  const [errors , setErrors] = useState('')

  const params = useParams();
  const navigate = useNavigate();

  useEffect(()=>{
    if(params.id != '' && params.id != undefined){
        axios.put(`http://localhost:5000/api/website/user/details/${params.id}`)
        .then((result)=>{
            if(result.data._status == true){
                Setuserdetail(result.data._data)
               Setupdate(result.data._data._id)
              setselectimage(result.data.image + '/' + result.data._data.image)
            }
        })
        .catch(()=>{
            iziToast.error({
                message : 'Something went wrong'
            })
        })
    }
  },[params])
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
                axios.put(`http://localhost:5000/api/website/user/update/${update}`,event.target)
                 .then((result)=>{
                if(result.data._status == true){
                    event.target.reset();
                    iziToast.success({
                        message : result.data._message
                    })
                   navigate('/usermangement/user')
                }else{
                    iziToast.error({
                        message : result.data._message
                    })
                }
            })
            .catch(()=>{
                iziToast.error({
                    message : result.data._message
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
                               <Link to={`/usermangement/user`}>
                                <li>
                               User
                                </li>
                               </Link>
                                <li>
                                    /
                                </li>
                                <li>
                                    {
                                        update
                                            ?
                                            'Update'
                                            :
                                            'Add'
                                    }
                                </li>
                            </ul>
                        </div>
                        <div className='faqouter'>
                            <h1>User </h1>
                        </div>
                        <hr />
                        <form onSubmit={formhandler}>
                            <div className='faqinner'>
                                        <h5>update Userdata </h5>
                                <div class="container">
                                    <div class="containercard">
                                        <h2>Upload Image <FaFileImage/></h2> 
                                    </div>
                                    <div className='innercard'>
                                        {!selectimage && (
                                           <div className='outterimage'>
                                            <div className='innerimage'>
                                               <p className='innerimageheading'><span>Click to upload</span> or drag and drop</p> 
                                            </div>
                                           </div>
                                        )}
                                        {selectimage && (
                                            <img
                                                src={selectimage}
                                                alt="Selected"
                                                className="imageselect"
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
                                <div className='faqlabel'>
                                    <label>
                                        Enter User Name
                                    </label>
                                </div>
                                <div className='faqinput'>
                                    <input
                                        name='name'
                                        placeholder='Enter Name '
                                        defaultValue={userdetail.name}
                                        onKeyUp={ErrorHandler}
                                    />
                                    {
                                        errors.includes("name") && (
                                            <p className='error'>
                                                name is required
                                            </p>
                                        )}
                                </div>
                                <div className='faqlabel'>
                                    <label>
                                        Enter User Email
                                    </label>
                                </div>
                                <div>
                                    <input
                                        name='email'
                                        placeholder='Enter Email '
                                        defaultValue={userdetail.email}
                                        onKeyUp={ErrorHandler}
                                    />
                                    {
                                        errors.includes("email") && (
                                            <p className='error'>
                                                designation is required
                                            </p>
                                        )}
                                </div>
                                <div className='faqlabel'>
                                    <label>
                                        Enter User Mobile-Number
                                    </label>
                                </div>
                                <div className='faqinput'>
                                    <input
                                        name='mobile_number'
                                        type='number'
                                        placeholder='Enter Mobile-Number '
                                        defaultValue={userdetail.mobile_number}
                                        onKeyUp={ErrorHandler}
                                    />
                                    {
                                        errors.includes("mobile_number") && (
                                            <p className='error'>
                                                Mobile-Number is required
                                            </p>
                                        )}
                                </div>
                                <button type='submit'>                                  
                                            Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
    </>
  )
}
