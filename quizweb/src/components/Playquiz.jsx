import React, { useEffect, useState } from 'react'
import Header from '../Common/Header'
import axios from 'axios'
import iziToast from 'izitoast'
import { CiClock2 } from 'react-icons/ci'
import { Link, useParams } from 'react-router-dom'
import Quizimg from '../assets/images/time.png'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export default function Playquiz() {
    const [Quiz, setQuiz] = useState([])

    const navigate = useNavigate();
    const { id } = useParams();
    console.log(id)
    if (id != '' && id != undefined) {
        console.log(id)
        useEffect(() => {
            axios.post(`http://localhost:5000/api/website/quiz/view`, {
                topicid: id
            })
                .then((result) => {
                    if (result.data._status == true) {
                        setQuiz(result.data._data)
                        console.log(result.data._data)
                    } else {
                        setQuiz([])
                    }
                })
                .catch(() => {
                    iziToast.error({
                        message: "something went wrong"
                    })
                })
        }, [id])
    }
    var cookies = Cookies.get('user_token')
    if (cookies == '' || cookies == undefined) {
        iziToast.info({
            message:'Ready to test your knowledge? Please log in first to start your quiz journey!'
        });
        navigate('/login')
    }

    return (
        <>
            <Header />
            <div class="quiz-container">
                {
                    Quiz.length > 0
                        ?
                        Quiz.map((value, index) => {
                            return (
                                <div class="Quizcard">
                                    <img src={Quizimg} />
                                    <h3>{value.name}</h3>
                                    <div class="meta">
                                        <b>10 Questions</b>
                                    </div>
                                    <button className='quizplay'>
                                        <Link to={`/start/${value._id}`}>
                                            Play Quiz
                                        </Link>
                                    </button>

                                </div>
                            )
                        })
                        :
                        <>

                            <div class="Norecord Quizcard">
                                <h3>No Record Found</h3>
                            </div>

                        </>
                }

            </div>
        </>
    )
}
