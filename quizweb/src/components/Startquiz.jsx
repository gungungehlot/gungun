import axios from 'axios'
import iziToast from 'izitoast'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '../Common/Header'
import Cookies from 'js-cookie'

export default function Startquiz() {
  const [Currentquestion, Setcurrentquestion] = useState(0)
  const [Quiz, Setquiz] = useState([])
  const [quizquestion, Setquizquestion] = useState({})
  const [selected, setSelected] = useState(null)
  const [Locked, setLocked] = useState(false)
  const [score, setScore] = useState(0)


  const navigate = useNavigate();
  const id  = useParams();

  const nextbutton = () => {
  optionselect()

  if (Currentquestion < Quiz.length - 1) {
    Setcurrentquestion(Currentquestion + 1)
  }

  setSelected(null)
  setLocked(false)
}
  const previousbutton = () => {
    if (Currentquestion > 0) {
      Setcurrentquestion(Currentquestion - 1)
    }
    console.log(Currentquestion)
  }
  const optionselect = () => {
    const correctAnswer = Quiz[Currentquestion]?.answer
    console.log("correct answer is ", correctAnswer)
    if (selected?.trim().toLowerCase() === correctAnswer?.trim().toLowerCase()) {
      console.log("yes right")
      setScore(score +1)
      console.log(score,'Sore')
      toast(' Great job! That’s the correct answer!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(' Oops! That’s not correct. Try the next one!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }
  }
//  const savescore = () => {
//   axios.post(
//     "http://localhost:5000/website/score/savescore",
//     {
//       quizId: Quiz._id,
//       quizName: Quiz.name,
//       score: score,
//       total: Quiz.questions.length
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${Cookies.get("user_token")}`
//       }
//     }
//   )
//   .then((result) => {
//     console.log(result.data._data)
//     if(result.data._data._is_token == 0){
//       iziToast.success({
//       message: result.data._message
//     });
//     }else{
//       navigate('/login') 
//     }
//   })
//   .catch((err) => {
//     console.log(err);

//     iziToast.error({
//       message: "Something went wrong"
//     });
//   });
// };
const savescore = () => {


    
  const payload = {
    quizId: quizquestion._id,
    quizName: quizquestion.name,
    score: score,
    total: Quiz.length,
    accuracy: ((score / Quiz.length) * 100).toFixed(0)
  };

  console.log("Payload => ", payload);

  axios.post(
    "http://localhost:5000/website/score/savescore",
    payload,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`
      }
    }
  )
  .then((result) => {

    console.log(result.data);

    if(result.data._is_token == 1){

      navigate('/login')

    }else{

      iziToast.success({
        message: result.data._message
      })

    }

  })
  .catch((err) => {

    console.log(err);

    iziToast.error({
      message: "Something went wrong"
    });

  });

};  
useEffect(() => {
    axios.post(`http://localhost:5000/api/website/quiz/view`,{
     _id : id.id
    })
      .then((result) => {

         Setquizquestion(result.data._data[0]);
           console.log(result.data._data[0])

        console.log("Full Data Quiz api", result.data._data)

        if (result.data?._status === true) {

          const quizObj = result.data?._data?.[0]?.Quizobj
          if (quizObj) {
            // object convert into array
            const quizArray = Object.values(quizObj)
            // save in setquiz
            Setquiz(quizArray)
            console.log(" quizarray output", quizArray)
          } else {
            console.log("Quizobj not found ")
            Setquiz([])
          }

        } else {
          Setquiz([])
        }
      })
      .catch(() => {
        iziToast.error({
          message: 'Something went wrong'
        })
      })
  }, [])
  return (
    <div class="quiz-container">
      <Header/>
      {
        Quiz.length > 0
          ?
          <div class="quiz-card">
            <div class="top-bar">
              <span>Question {Currentquestion + 1}/{Quiz.length}</span>
              <span>⏱️ 30s</span>
            </div>
            <div class="question" >
              {Quiz[Currentquestion]?.question}
            </div>
            {Object.values(Quiz[Currentquestion]?.option || {}).map((opt, i) => (
              <div class="quizoptions" key={i}>
                <div class={`quizoption 
                 ${selected === opt ? "active" : ""} 
                 ${Locked ? "lock" : ""}`}
                  onClick={() => {
                    if (!Locked) {
                      setSelected(opt)
                      setLocked(true)
                    }
                  }}
                > {opt}</div>
              </div>
            ))}
            <div class="quizbuttons">
              <button class="prev" disabled={Currentquestion === 0} onClick={previousbutton}>⬅ Previous</button>
              {
                Currentquestion === Quiz.length - 1
                  ?
                  <Link to={`/score`}>
                    <button class="next" onClick={savescore} >Submit</button>
                  </Link>
                  :
                  <button class="next" onClick={nextbutton}>Next ➡</button>
              }
            </div>
          </div>
          :
          ''
      }

    </div>
  )
}
