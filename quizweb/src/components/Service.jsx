import React from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { IoCreateOutline } from 'react-icons/io5'
import { FcFlashAuto, FcSalesPerformance } from 'react-icons/fc'
import { MdFeedback } from 'react-icons/md'
import { Link } from 'react-router-dom'

export default function Service() {
  return (
    <>
     <Header/>
        <section className="servies" >
  <div class="container">
    <h1>Teach smarter, not harder</h1>
    <p class="subtitle">Create and share quizzes effortlessly with powerful tools</p>

    <div class="services">
      
      <div class="cards">
        <h3><IoCreateOutline/>  Easy Quiz Creation</h3>
        <p>Build quizzes quickly with text, images, and code support.</p>
      </div>

      <div class="cards">
        <h3> <FcFlashAuto/> Auto-Grading</h3>
        <p>Automatically check answers and provide instant results.</p>
      </div>

      <div class="cards">
        <h3><MdFeedback/>  Smart Feedback</h3>
        <p>Give personalized feedback to improve learning.</p>
      </div>

      <div class="cards">
        <h3><FcSalesPerformance/>  Performance Tracking</h3>
        <p>Monitor student progress with real-time analytics.</p>
      </div>

    </div>

    <Link to={'/createquiz'} className='btn'>
    Create Your Quiz
    </Link>
    {/* <a href="#" class="btn">Create Your Quiz</a> */}
  </div>

</section>
<Footer/>
    </>
  )
}
