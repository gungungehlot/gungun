import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaFileImage } from 'react-icons/fa6'
import axios from 'axios'
import iziToast from 'izitoast'
import Cookies from 'js-cookie'

export default function Addquiz() {
    const [errors, setErrors] = useState([])
    const [update, Setupdate] = useState('')
    const [selectimage, setselectimage] = useState('')
    const [quizdetail, Setquizdetail] = useState([])
    const [quizquestion, Setquizquestion] = useState({})
    const [topic, Settopic] = useState([])
    const [topicdetail, setTopicDetail] = useState('')
    const navigate = useNavigate();
    const params = useParams();


    useEffect(() => {
        if (params.id != '' && params.id != undefined) {
            axios.put(`http://localhost:5000/api/website/quiz/detail/${params.id}`)
                .then((result) => {
                    if (result.data._status == true) {
                        Setquizdetail(result.data._data)
                        Setquizquestion(result.data._data.Quizobj)
                        setselectimage(result.data.image + '/' + result.data._data.image)
                        Setupdate(result.data._data._id)

                    } else {
                        Setquizdetail([])
                    }
                })
                .catch(() => {
                    iziToast.error({
                        message: 'Something went wrong'
                    })
                })
        }
    }, [params])

    // topic view api
    useEffect(() => {
        axios.post(`http://localhost:5000/api/admin/topic/view`)
            .then((result) => {
                if (result.data._status == true) {
                    Settopic(result.data._data)
                } else {
                    Settopic([])
                }
            })
            .catch(() => {
                iziToast.error({
                    message: 'Something went wrong'
                })
            })
    }, [])
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
        console.log(update)
        if (arrayerror.length == 0) {
            if (update == '') {
                axios.post(`http://localhost:5000/api/website/quiz/create`, event.target, { headers: { Authorization: `Bearer ${Cookies.get('admin_token')}` } })
                    .then((result) => {
                        if (result.data._status == true) {
                            event.target.reset();
                            iziToast.success({
                                message: result.data._message
                            })
                            navigate('/quiz/view')
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
            } else {
                axios.put(`http://localhost:5000/api/website/quiz/update/${update}`, event.target, { headers: { Authorization: `Bearer ${Cookies.get('admin_token')}` } })
                    .then((result) => {
                        event.target.reset();
                        if (result.data._status == true) {
                            iziToast.success({
                                message: result.data._message
                            })
                            navigate('/quiz/view')
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
                            <Link to={`/quiz/view`}>
                                <li>
                                    Quiz
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
                        <h1>Quiz </h1>
                    </div>
                    <hr />
                    <form onSubmit={formhandler}>
                        <div className='faqinner'>
                            {
                                update
                                    ?
                                    <h5>Update Quiz </h5>
                                    :
                                    <h5>Add Quiz </h5>
                            }
                            <div class="container">
                                <div class="containercard">
                                    <h2>Upload Image <FaFileImage /></h2>
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
                                    defaultValue={quizdetail.name}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("name") && (
                                        <p className='error'>
                                            name is required
                                        </p>
                                    )}
                            </div>
                            {/* quiz select */}
                            <div className='faqlabel'>
                                <label>
                                    Select Quiz Topic
                                </label>
                            </div>
                            <select name='topicid' onChange={ErrorHandler} > Quiz Topic
                                <option value=''>Quiz Topic</option>
                                {
                                    topic.map((value, index) => {
                                        return (
                                            <option value={value._id} selected = {quizdetail.topicid == value._id} key={index}>{value.name}</option>
                                        )
                                    })
                                }
                            </select>
                            {
                                errors.includes("topicid") && (
                                    <p className='error'>
                                        topicid is required
                                    </p>
                                )}
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
                                    defaultValue={quizquestion?.question1?.question}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("question1") && (
                                        <p className='error'>
                                            question1 is required
                                        </p>
                                    )}
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
                                    defaultValue={quizquestion?.question1?.answer}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("answer1") && (
                                        <p className='error'>
                                            answer is required
                                        </p>
                                    )}
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
                                        defaultValue={quizquestion?.question1?.option?.option_a}
                                    />
                                    {
                                        errors.includes("option1a") && (
                                            <p className='error'>
                                                option 1 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option1b'
                                        placeholder='option2'
                                        defaultValue={quizquestion?.question1?.option?.option_b}
                                    />
                                    {
                                        errors.includes("option1b") && (
                                            <p className='error'>
                                                option 2 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option1c'
                                        placeholder='option3'
                                        defaultValue={quizquestion?.question1?.option?.option_c}
                                    />
                                    {
                                        errors.includes("option1c") && (
                                            <p className='error'>
                                                option 3 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option1d'
                                        placeholder='option4'
                                        defaultValue={quizquestion?.question1?.option?.option_d}
                                    />
                                    {
                                        errors.includes("option1d") && (
                                            <p className='error'>
                                                option 4 is required
                                            </p>
                                        )}
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
                                    defaultValue={quizquestion?.question2?.question}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("question2") && (
                                        <p className='error'>
                                            question1 is required
                                        </p>
                                    )}
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
                                    defaultValue={quizquestion?.question2?.answer}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("answer2") && (
                                        <p className='error'>
                                            answer is required
                                        </p>
                                    )}
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
                                        defaultValue={quizquestion?.question2?.option?.option_a}
                                    />
                                    {
                                        errors.includes("option2a") && (
                                            <p className='error'>
                                                option 1 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option2b'
                                        placeholder='option2'
                                        defaultValue={quizquestion?.question2?.option?.option_b}
                                    />
                                    {
                                        errors.includes("option2b") && (
                                            <p className='error'>
                                                option 2 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option2c'
                                        placeholder='option3'
                                        defaultValue={quizquestion?.question2?.option?.option_c}
                                    />
                                    {
                                        errors.includes("option2c") && (
                                            <p className='error'>
                                                option 3 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option2d'
                                        placeholder='option4'
                                        defaultValue={quizquestion?.question2?.option?.option_d}
                                    />
                                    {
                                        errors.includes("option2d") && (
                                            <p className='error'>
                                                option 4 is required
                                            </p>
                                        )}
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
                                    defaultValue={quizquestion?.question3?.question}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("question3") && (
                                        <p className='error'>
                                            question3 is required
                                        </p>
                                    )}
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
                                    defaultValue={quizquestion?.question3?.answer}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("answer3") && (
                                        <p className='error'>
                                            answer is required
                                        </p>
                                    )}
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
                                        defaultValue={quizquestion?.question3?.option?.option_a}
                                    />
                                    {
                                        errors.includes("option3a") && (
                                            <p className='error'>
                                                option 1 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option3b'
                                        placeholder='option2'
                                        defaultValue={quizquestion?.question3?.option?.option_b}
                                    />
                                    {
                                        errors.includes("option3b") && (
                                            <p className='error'>
                                                option 2 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option3c'
                                        placeholder='option3'
                                        defaultValue={quizquestion?.question3?.option?.option_c}
                                    />
                                    {
                                        errors.includes("option3c") && (
                                            <p className='error'>
                                                option 3 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option3d'
                                        placeholder='option4'
                                        defaultValue={quizquestion?.question3?.option?.option_d}
                                    />
                                    {
                                        errors.includes("option3d") && (
                                            <p className='error'>
                                                option 4 is required
                                            </p>
                                        )}
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
                                    defaultValue={quizquestion?.question4?.question}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("question4") && (
                                        <p className='error'>
                                            question4 is required
                                        </p>
                                    )}
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
                                    defaultValue={quizquestion?.question4?.answer}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("answer4") && (
                                        <p className='error'>
                                            answer is required
                                        </p>
                                    )}
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
                                        defaultValue={quizquestion?.question4?.option.option_a}
                                    />
                                    {
                                        errors.includes("option4a") && (
                                            <p className='error'>
                                                option 1 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option4b'
                                        placeholder='option2'
                                        defaultValue={quizquestion?.question4?.option.option_b}
                                    />
                                    {
                                        errors.includes("option4b") && (
                                            <p className='error'>
                                                option 2 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option4c'
                                        placeholder='option3'
                                        defaultValue={quizquestion?.question4?.option.option_c}
                                    />
                                    {
                                        errors.includes("option4c") && (
                                            <p className='error'>
                                                option 3 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option4d'
                                        placeholder='option4'
                                        defaultValue={quizquestion?.question4?.option.option_d}
                                    />
                                    {
                                        errors.includes("option4d") && (
                                            <p className='error'>
                                                option 4 is required
                                            </p>
                                        )}
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
                                    defaultValue={quizquestion?.question5?.question}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("question5") && (
                                        <p className='error'>
                                            question5 is required
                                        </p>
                                    )}
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
                                    defaultValue={quizquestion?.question5?.answer}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("answer5") && (
                                        <p className='error'>
                                            answer is required
                                        </p>
                                    )}
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
                                        defaultValue={quizquestion?.question5?.option.option_a}
                                    />
                                    {
                                        errors.includes("option5a") && (
                                            <p className='error'>
                                                option 1 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option5b'
                                        placeholder='option2'
                                        defaultValue={quizquestion?.question5?.option.option_b}
                                    />
                                    {
                                        errors.includes("option5b") && (
                                            <p className='error'>
                                                option 2 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option5c'
                                        placeholder='option3'
                                        defaultValue={quizquestion?.question5?.option.option_c}
                                    />
                                    {
                                        errors.includes("option5c") && (
                                            <p className='error'>
                                                option 3 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option5d'
                                        placeholder='option4'
                                        defaultValue={quizquestion?.question5?.option.option_d}
                                    />
                                    {
                                        errors.includes("option5d") && (
                                            <p className='error'>
                                                option 4 is required
                                            </p>
                                        )}
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
                                    defaultValue={quizquestion?.question6?.question}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("question6") && (
                                        <p className='error'>
                                            question6 is required
                                        </p>
                                    )}
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
                                    defaultValue={quizquestion?.question6?.answer}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("answer6") && (
                                        <p className='error'>
                                            answer is required
                                        </p>
                                    )}
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
                                        defaultValue={quizquestion?.question6?.option.option_a}
                                    />
                                    {
                                        errors.includes("option6a") && (
                                            <p className='error'>
                                                option 1 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option6b'
                                        placeholder='option2'
                                        defaultValue={quizquestion?.question6?.option.option_b}
                                    />
                                    {
                                        errors.includes("option6b") && (
                                            <p className='error'>
                                                option 2 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option6c'
                                        placeholder='option3'
                                        defaultValue={quizquestion?.question6?.option.option_c}
                                    />
                                    {
                                        errors.includes("option6c") && (
                                            <p className='error'>
                                                option 3 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option6d'
                                        placeholder='option4'
                                        defaultValue={quizquestion?.question6?.option.option_d}
                                    />
                                    {
                                        errors.includes("option6d") && (
                                            <p className='error'>
                                                option 4 is required
                                            </p>
                                        )}
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
                                    defaultValue={quizquestion?.question7?.question}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("question7") && (
                                        <p className='error'>
                                            question is required
                                        </p>
                                    )}
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
                                    defaultValue={quizquestion?.question7?.answer}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("answer7") && (
                                        <p className='error'>
                                            answer is required
                                        </p>
                                    )}
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
                                        defaultValue={quizquestion?.question7?.option.option_a}
                                    />
                                    {
                                        errors.includes("option7a") && (
                                            <p className='error'>
                                                option 1 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option7b'
                                        placeholder='option2'
                                        defaultValue={quizquestion?.question7?.option.option_b}
                                    />
                                    {
                                        errors.includes("option7b") && (
                                            <p className='error'>
                                                option 2 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option7c'
                                        placeholder='option3'
                                        defaultValue={quizquestion?.question7?.option.option_c}
                                    />
                                    {
                                        errors.includes("option7c") && (
                                            <p className='error'>
                                                option 3 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option7d'
                                        placeholder='option4'
                                        defaultValue={quizquestion?.question7?.option.option_d}
                                    />
                                    {
                                        errors.includes("option7d") && (
                                            <p className='error'>
                                                option 4 is required
                                            </p>
                                        )}
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
                                    defaultValue={quizquestion?.question8?.question}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("question8") && (
                                        <p className='error'>
                                            question is required
                                        </p>
                                    )}
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
                                    defaultValue={quizquestion?.question8?.answer}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("answer8") && (
                                        <p className='error'>
                                            answer is required
                                        </p>
                                    )}
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
                                        placeholder='option1'
                                        defaultValue={quizquestion?.question8?.option.option_a}
                                    />
                                    {
                                        errors.includes("option8a") && (
                                            <p className='error'>
                                                option 1 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option8b'
                                        placeholder='option2'
                                        defaultValue={quizquestion?.question8?.option.option_b}
                                    />
                                    {
                                        errors.includes("option8b") && (
                                            <p className='error'>
                                                option 2 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option8c'
                                        placeholder='option3'
                                        defaultValue={quizquestion?.question8?.option.option_c}
                                    />
                                    {
                                        errors.includes("option8c") && (
                                            <p className='error'>
                                                option 3 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option8d'
                                        placeholder='option4'
                                        defaultValue={quizquestion?.question8?.option.option_c}
                                    />
                                    {
                                        errors.includes("option8d") && (
                                            <p className='error'>
                                                option 4 is required
                                            </p>
                                        )}
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
                                    defaultValue={quizquestion?.question9?.question}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("question9") && (
                                        <p className='error'>
                                            question is required
                                        </p>
                                    )}
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
                                    defaultValue={quizquestion?.question9?.answer}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("answer9") && (
                                        <p className='error'>
                                            answer is required
                                        </p>
                                    )}
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
                                        placeholder='option1'
                                        defaultValue={quizquestion?.question9?.option.option_a}
                                    />
                                    {
                                        errors.includes("option9a") && (
                                            <p className='error'>
                                                option 1 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option9b'
                                        placeholder='option2'
                                        defaultValue={quizquestion?.question9?.option.option_b}
                                    />
                                    {
                                        errors.includes("option9b") && (
                                            <p className='error'>
                                                option 2 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option9c'
                                        placeholder='option3'
                                        defaultValue={quizquestion?.question9?.option.option_c}
                                    />
                                    {
                                        errors.includes("option9c") && (
                                            <p className='error'>
                                                option 3 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option9d'
                                        placeholder='option4'
                                        defaultValue={quizquestion?.question9?.option.option_d}
                                    />
                                    {
                                        errors.includes("option9d") && (
                                            <p className='error'>
                                                option 4 is required
                                            </p>
                                        )}
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
                                    defaultValue={quizquestion?.question10?.question}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("question10") && (
                                        <p className='error'>
                                            question is required
                                        </p>
                                    )}
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
                                    defaultValue={quizquestion?.question10?.answer}
                                    onKeyUp={ErrorHandler}
                                />
                                {
                                    errors.includes("answer10") && (
                                        <p className='error'>
                                            answer is required
                                        </p>
                                    )}
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
                                        defaultValue={quizquestion?.question10?.option.option_a}
                                    />
                                    {
                                        errors.includes("option10a") && (
                                            <p className='error'>
                                                option 1 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option10b'
                                        placeholder='option2'
                                        defaultValue={quizquestion?.question10?.option.option_b}
                                    />
                                    {
                                        errors.includes("option10b") && (
                                            <p className='error'>
                                                option 2 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option10c'
                                        placeholder='option3'
                                        defaultValue={quizquestion?.question10?.option.option_c}
                                    />
                                    {
                                        errors.includes("option10c") && (
                                            <p className='error'>
                                                option 3 is required
                                            </p>
                                        )}
                                </div>
                                <div className='options'>
                                    <input
                                        type='text'
                                        name='option10d'
                                        placeholder='option4'
                                        defaultValue={quizquestion?.question10?.option.option_d}
                                    />
                                    {
                                        errors.includes("option10d") && (
                                            <p className='error'>
                                                option 4 is required
                                            </p>
                                        )}
                                </div>
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
