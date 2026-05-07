import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import iziToast from 'izitoast'
import { FaFileImage, FaFileImport } from 'react-icons/fa'

export default function Addtestimonial() {
    const [errors, setErrors] = useState([])
    const [update, Setupdate] = useState('')
    const [faqdetail, Setfaqdetail] = useState('')
    const [selectimage, setselectimage] = useState('')
    const [testimonialdetail , Settestimonialdetail] = useState('')

    // navigate function
    const navigate = useNavigate();
    const params = useParams()
  useEffect(()=>{
      if(params.id != '' && params.id != undefined){
        console.log(params.id)
        axios.put(`http://localhost:5000/api/website/testimonial/details/${params.id}`)
        .then((result)=>{
            if(result.data._status == true){
                Settestimonialdetail(result.data._data)
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
    // formhandler function
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
            if(update == ''){
                 axios.post(`http://localhost:5000/api/website/testimonial/create`,event.target)
            .then((result)=>{
                if(result.data._status == true){
                    event.target.reset();
                    iziToast.success({
                        message : result.data._message
                    })
                    navigate('/testimonial/view')
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
            else{
                axios.put(`http://localhost:5000/api/website/testimonial/update/${update}`,event.target)
                 .then((result)=>{
                if(result.data._status == true){
                    event.target.reset();
                    iziToast.success({
                        message : result.data._message
                    })
                    navigate('/testimonial/view')
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
                           <Link to={`/testimonial/view`}>
                            <li>
                            Testimonial
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
                        <h1>Testimonial </h1>
                    </div>
                    <hr />
                    <form onSubmit={formhandler}>
                        <div className='faqinner'>
                            {
                                update
                                    ?
                                    <h5>Update Testimonial </h5>
                                    :
                                    <h5>Add Testimonial </h5>
                            }
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
                                    Enter Name
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='name'
                                    placeholder='Enter Name '
                                    defaultValue={testimonialdetail.name}
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
                                    Enter  Designation
                                </label>
                            </div>
                            <div className='faqinput' >
                                <input
                                    name='designation'
                                    placeholder='Enter Designation '
                                    defaultValue={testimonialdetail.designation}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("designation") && (
                                        <p className='error'>
                                            designation is required
                                        </p>
                                    )}
                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Description
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='discription'
                                    placeholder='Enter Discription '
                                    defaultValue={testimonialdetail.discription}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("discription") && (
                                        <p className='error'>
                                            Description is required
                                        </p>
                                    )}
                            </div>
                            <button type='submit'>
                                {
                                    update
                                        ?
                                        'Update'
                                        :
                                        'Submit'
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
