import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import iziToast from "izitoast";

export default function Addtopic() {
    const [errors , setErrors] = useState([])
    const [update ,setupdate]  = useState('')
    const [TopicDetails , SetTopicDetails] = useState('')
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
    // detail api
    useEffect(()=>{
        if(params.id != '' && params.id != undefined){
            axios.put(`http://localhost:5000/api/admin/topic/detail/${params.id}`)
            .then((result)=>{
                if(result.data._status == true){
                    SetTopicDetails(result.data._data)
                    setupdate(result.data._data._id)
                }else{
                    
                    SetTopicDetails('')
                }
            })
            .catch(()=>{
                iziToast.error({
                    message : 'Somethng went wrong'
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
        // console.log(arrayerror)
        if(arrayerror .length == 0){
            if(update == ''){
                axios.post(`http://localhost:5000/api/admin/topic/create`,{
                name : event.target.name.value,
                order : event.target.order.value
            })
            .then((result)=>{
                if(result.data._status == true){
                    iziToast.success({
                        message : result.data._message
                    })
                     navigate('/topic/view')
                } else{
                    iziToast.error({
                        message : result.data._message
                    })
                }
            })
            .catch(()=>{
                iziToast.error({
                    message : 'Something went wrong'
                })
            })
            }else{
                axios.put(`http://localhost:5000/api/admin/topic/update/${update}`,{
                name : event.target.name.value,
                order : event.target.order.value
            })
            .then((result)=>{
                if(result.data._status == true){
                    event.target.reset();
                    iziToast.success({
                        message : result.data._message
                    })
                     navigate('/topic/view')
                } else{
                    iziToast.error({
                        message : result.data._message
                    })
                }
            })
            .catch(()=>{
                iziToast.error({
                    message : 'Something went wrong'
                })
            })
            }
        }
    }
  return (
     <>
                <div class='usermain'>
                    <Sidebar/>
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
                                <Link to={`/topic/view`}>
                                <li>
                                Topic
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
                            <h1>Quiz Topic </h1>
                        </div>
                        <hr />
                        <form onSubmit={formhandler}>
                            <div className='faqinner'>
                                {
                                    update
                                        ? 
                                         <h5>Update Testimonial </h5> 
                                         : 
                                        <h5>Add Quiz Topic  </h5>
                                } 
                                <div className='faqlabel'>
                                    <label>
                                        Enter Quiz Topic Name
                                    </label>
                                </div>
                                <div className='faqinput'>
                                    <input
                                        name='name'
                                        placeholder='Enter Quiz Topic Name '
                                        onKeyUp={ErrorHandler}
                                        defaultValue={TopicDetails.name}
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
                                        Enter Order
                                    </label>
                                </div>
                                <div>
                                    <input
                                        name='order'
                                        placeholder='Enter Order '
                                        onKeyUp={ErrorHandler}
                                        defaultValue={TopicDetails.order}
                                    />
                                    {
                                        errors.includes("order") && (
                                            <p className='error'>
                                                order is required
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
