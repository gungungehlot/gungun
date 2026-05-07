import axios from 'axios';
import iziToast from 'izitoast';
import React, { useEffect, useState } from 'react'
import { FaFileImage } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom'
import Header from '../Common/Header';
import Cookies from 'js-cookie'

export default function Createquiz() {
    const [selectimage, setselectimage] = useState('')
    const [topic , setTopic] = useState([])
    const [error , setErrors] = useState('')

    const navigate = useNavigate();

    // topic view api
    useEffect(()=>{
        axios.post(`http://localhost:5000/api/admin/topic/view`)
    .then((result)=>{
        if(result.data._status == true){
            setTopic(result.data._data)
        }
    })
    .catch(()=>{
        iziToast.error({
            message : 'Something went wrong'
        })
    })
    },[])
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
                axios.post(`http://localhost:5000/api/website/quiz/create`, event.target,{ headers: { Authorization: `Bearer ${Cookies.get('admin_token')}` } })
                    .then((result) => {
                        if (result.data._status == true) {
                            event.target.reset();
                            iziToast.success({
                                message: result.data._message
                            })
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
                <Header/>
                <div class='  userdetail'>
                    <hr />
                    <form onSubmit={formhandler}>
                        <div className='faqinner'>

                            <h5>Create Quiz </h5>

                            <div class="container">
                                <div class="containercard">
                                    <h2>Quiz Image </h2>
                                </div>
                                <div className='innercard'>
                                    {!selectimage && (
                                        <div className='outterimage'>
                                            <div className='innerimage'>
                                                <p className='innerimageheading'><span><FaPlus className='plus'/></span> or drag and drop</p>
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
                            {/* quiz name */}
                            <div className='quiznameselect'>

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz Name
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='name'
                                    placeholder='Enter Name '
                                    required
                                />
                                
                            </div>
                            {/* quiz select */}
                            <div className='faqlabel'>
                                <label>
                                    Select Quiz Topic
                                </label>
                            </div>
                            <select name='topicid'  > Quiz Topic
                                <option value=''>Quiz Topic</option>
                                {
                                    topic.map((value, index) => {
                                        return (
                                            <option  value={value._id} key={index} >{value.name}</option>
                                        )
                                    })
                                }
                            </select>

                            {/* 1 */}
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 1 Question
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='question1'
                                    placeholder='Enter Quiz 1 Question'
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 1 Answer
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='answer1'
                                    placeholder='Enter Quiz 1 Answer '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Quiz Options
                                </label>
                            </div>
                            <div className='option'>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option1a'
                                        placeholder='option1'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option1b'
                                        placeholder='option2'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option1c'
                                        placeholder='option3'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option1d'
                                        placeholder='option4'
                                        required
                                    />

                                </div>
                            </div>
                            {/* 2 question */}
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 2 Question
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='question2'
                                    placeholder='Enter Quiz 2 Question '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 2 Answer
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='answer2'
                                    placeholder='Enter Quiz 2 Answer '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Quiz Options
                                </label>
                            </div>
                            <div className='option'>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option2a'
                                        placeholder='option1'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option2b'
                                        placeholder='option2'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option2c'
                                        placeholder='option3'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option2d'
                                        placeholder='option4'
                                        required
                                    />

                                </div>
                            </div>
                            {/* 3 question */}
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 3 Question
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='question3'
                                    placeholder='Enter Quiz 3 Question '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 3 Answer
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='answer3'
                                    placeholder='Enter Quiz 3 Answer '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Quiz Options
                                </label>
                            </div>
                            <div className='option'>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option3a'
                                        placeholder='option1'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option3b'
                                        placeholder='option2'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option3c'
                                        placeholder='option3'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option3d'
                                        placeholder='option4'
                                        required
                                    />

                                </div>
                            </div>
                            {/* 4 question */}
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 4 Question
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='question4'
                                    placeholder='Enter Quiz 4 Question '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 4 Answer
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='answer4'
                                    placeholder='Enter Quiz 4 Answer '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Quiz Options
                                </label>
                            </div>
                            <div className='option'>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option4a'
                                        placeholder='option1'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option4b'
                                        placeholder='option2'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option4c'
                                        placeholder='option3'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option4d'
                                        placeholder='option4'
                                        required
                                    />

                                </div>
                            </div>
                            {/* 5 */}
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 5 Question
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='question5'
                                    placeholder='Enter Quiz 5 Question '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 5 Answer
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='answer5'
                                    placeholder='Enter Quiz 5 Answer '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Quiz Options
                                </label>
                            </div>
                            <div className='option'>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option5a'
                                        placeholder='option1'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option5b'
                                        placeholder='option2'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option5c'
                                        placeholder='option3'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option5d'
                                        placeholder='option4'
                                        required
                                    />

                                </div>
                            </div>
                            {/* 6 */}
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 6 Question
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='question6'
                                    placeholder='Enter Quiz 6 Question '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 6 Answer
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='answer6'
                                    placeholder='Enter Quiz 6 Answer '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Quiz Options
                                </label>
                            </div>
                            <div className='option'>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option6a'
                                        placeholder='option1'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option6b'
                                        placeholder='option2'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option6c'
                                        placeholder='option3'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option6d'
                                        placeholder='option4'
                                        required
                                    />

                                </div>
                            </div>
                            {/* 7 */}
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 7 Question
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='question7'
                                    placeholder='Enter Quiz 7 Question '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 7 Answer
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='answer7'
                                    placeholder='Enter Quiz 7 Answer '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Quiz Options
                                </label>
                            </div>
                            <div className='option'>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option7a'
                                        placeholder='option1'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option7b'
                                        required
                                    />
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option7c'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option7d'
                                        required
                                    />

                                </div>
                            </div>
                            {/* 8 */}
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 8 Question
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='question8'
                                    placeholder='Enter Quiz 8 Question '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 8 Answer
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='answer8'
                                    placeholder='Enter Quiz 8 Answer '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Quiz Options
                                </label>
                            </div>
                            <div className='option'>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option8a'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option8b'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option8c'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option8d'
                                        required
                                    />

                                </div>
                            </div>
                            {/* 9th question */}
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 9 Question
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='question9'
                                    placeholder='Enter Quiz 9 Question '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 9 Answer
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='answer9'
                                    placeholder='Enter Quiz 9 Answer '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Quiz Options
                                </label>
                            </div>
                            <div className='option'>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option9a'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option9b'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option9c'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option9d'
                                        required
                                    />

                                </div>
                            </div>
                            {/* 10th */}
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 10 Question
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='question10'
                                    placeholder='Enter Quiz 10 Question '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Enter Quiz 10 Answer
                                </label>
                            </div>
                            <div className='faqinput'>
                                <input
                                    name='answer10'
                                    placeholder='Enter Quiz 10 Answer '
                                    required
                                />

                            </div>
                            <div className='faqlabel'>
                                <label>
                                    Quiz Options
                                </label>
                            </div>
                            <div className='option'>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option10a'
                                        placeholder='option1'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option10b'
                                        placeholder='option2'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option10c'
                                        placeholder='option3'
                                        required
                                    />

                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option10d'
                                        placeholder='option4'
                                        required
                                    />
                                </div>
                            </div>
                            <button type='submit'>
                                Create Quiz
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
