import React, { useEffect, useState } from 'react'
import Header from '../Common/Header'
import axios from 'axios'
import { toast } from 'react-toastify'
import iziToast from 'izitoast'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export default function Myscore() {

  const [data, setData] = useState([])
  const navigate = useNavigate();


  useEffect(() => {
    axios.post(`http://localhost:5000/website/score/viewscore`, {}, { headers: { Authorization: `Bearer ${Cookies.get('user_token')}` } })
      .then((result) => {
        if (result.data._status) {
          setData(result.data._data);
        } else {
          setData([]);

          if (result.data._is_token === 1) {
            Cookies.remove('user_token');

            iziToast.info({
              message: 'Session expired. Please login again.'
            });

            navigate('/login');
          }
        }
      })
      .catch(() => {
        iziToast.error({
          message: 'Something went wrong'
        })
      })
  }, [])

  return (
    <>
      <Header />
      <div className='scoremain'>
        {
          data.map((value, index) => {
            return (
              <>
                <div class="activity-card">
                  <div class="activity-header">
                    <h3>Quiz Activity</h3>
                    <span class="activity-date">
                      {
                        new Date(value.Create_at).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })
                      }
                    </span>
                  </div>

                  <div class="activity-body">


                    <div class="activity-row">
                      <span>Quiz:</span>
                      <p>{value.quizName}</p>
                    </div>

                    <div class="activity-row">
                      <span>Score:</span>
                      <p class="score">{value.score}</p>
                    </div>

                    <div class="activity-row">
                      <span>Accuracy:</span>
                      <p class=" accuracy ">{value.accuracy}%</p>
                    </div>

                    <div class="activity-row">
                      <span>Action:</span>
                      <p class="action">Quiz Played</p>
                    </div>

                  </div>

                </div>
              </>
            )
          })
        }
      </div>

    </>
  )
}
