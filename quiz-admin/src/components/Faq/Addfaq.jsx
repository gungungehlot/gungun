import React, { useState } from 'react'
import Sidebar from '../Sidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import iziToast from 'izitoast'
import axios from 'axios'

export default function Addfaq() {
const [errors , setErrors] = useState([])
const [update , Setupdate] = useState('')
const [faqdetail , Setfaqdetail] = useState('')

const params = useParams();

useEffect(()=>{
if(params.id != ''  && params.id != undefined){
  console.log(params.id)
axios.put(`http://localhost:5000/api/website/faq/details/${params.id}`)
.then((result)=>{
  Setfaqdetail(result.data._data)
  console.log(result.data._data)
  Setupdate(result.data._data._id)
  console.log(result.data._data._id)
})
}
},[params])





// navigate executable function
const navigate = useNavigate();
  // formhandler function
  const formhandler=(event) =>{
    event.preventDefault();
    
    var data =event.target;
    var field = data.querySelectorAll('input')
    var arrayerror = [] ;

    field.forEach((item)=>{
      if(item.name != 'image'){
        if(!item.value.trim()){
        arrayerror.push(item.name)
      }
      }
    })
    arrayerror = ([... new Set(arrayerror)])
    setErrors(arrayerror)
    console.log(arrayerror)
    if(arrayerror.length == 0){
      if(update == ''){
         axios.post(`http://localhost:5000/api/website/faq/create`,{
           question:event.target.question.value,
           answer:event.target.answer.value
        })
        .then((result)=>{
          if(result.data._status == true){
            event.target.reset()
            iziToast.success({
              message:result.data._message
            })
            navigate('/faq/view')
          }else{
            iziToast.error({
              message:result.data._message
            })
          }
        })
        .catch(()=>{
          iziToast.error({
              message:'something went wrong'
            })
        })
      }else{
         axios.put(`http://localhost:5000/api/website/faq/update/${update}`,{
           question:event.target.question.value,
           answer:event.target.answer.value
        })
        .then((result)=>{
          if(result.data._status == true){
            event.target.reset()
            iziToast.success({
              message:result.data._message
            })
            navigate('/faq/view')
          }else{
            iziToast.error({
              message:result.data._message
            })
          }
        })
        .catch(()=>{
          iziToast.error({
              message:'something went wrong'
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
                <Link to={`/faq/view`}>
                 <li>
                  Faq
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
                <h1>Frequentley Asked Question </h1>
              </div>
              <hr/>
              <form onSubmit={formhandler}>
              <div className='faqinner'>
                {
                  update
                  ?
                  <h5>Update Frequentley Asked Question </h5>
                  :
                  <h5>Add Frequentley Asked Question </h5>
                  }
                <div className='faqlabel'>
                 <label>
                  Enter  Question For Frequentley Asked Question
                 </label>
                </div>
               <div className='faqinput'>
                <input 
                name = 'question' 
                placeholder='Enter Question '
                defaultValue={faqdetail.question}
                onKeyUp={ErrorHandler}
                />
                {
                  errors.includes("question")&&(
                    <p className='error'>
                      question is required
                    </p>
                  )}
                </div>
                <div className='faqlabel'>
                 <label>
                  Enter  Answer Of Frequentley Asked Question
                 </label>
                </div>
               <div>
                <input
                name = 'answer' 
                placeholder='Enter Answer '
                defaultValue={faqdetail.answer}
                onKeyUp={ErrorHandler}
                />
               {
                errors.includes("answer")&&(
                  <p className='error'>
                    answer is required
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
