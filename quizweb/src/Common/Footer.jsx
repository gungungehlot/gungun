import axios from 'axios'
import iziToast from 'izitoast'
import React, { useEffect, useState } from 'react'
import { CgProfile } from 'react-icons/cg'
import { CiUser } from 'react-icons/ci'
import { FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa'
import { GrScorecard } from 'react-icons/gr'
import { IoLogoInstagram } from 'react-icons/io'
import { Link } from 'react-router-dom'

export default function Footer() {
  
  return (
    <>
     <footer className='footer'>
   <div className='footercontent'>
    <div className='footerelement'>
        <img src='src/assets/images/h2.gif'/>
    </div>
    <div className='footerelement'>
      <h3>Social Media Links</h3>
        <a href='#' className='icons'><IoLogoInstagram/></a>
        <a href='#' className='icons'><FaFacebook/></a>
         <a href='#' className='icons'><FaYoutube/></a>
         <a href='#' className='icons'><FaTwitter/></a>
    </div>
    <div className='footerelement'>
      <h3>User Section</h3>
     <div className='footerdiv'>
      <a href='/login' className='footerlinks'>
        Login/Register
      </a>
     </div>
     <div className='footerdiv'>

      <a href='/profile' className='footerlinks'>
        My Profile</a>
     </div>
     <div className='footerdiv'>
      <a href='/score' className='footerlinks'>
        {/* <GrScorecard/> */}
        My Score</a>
     </div>
    </div>

    <div className='footerelement'>
      <img src='src/assets/images/h.gif'/>
    </div>
    </div> 
     <div class="footer-bottom">
  © 2026 QuizUp | All Rights Reserved
</div>
    </footer> 
    </>
  )
}
