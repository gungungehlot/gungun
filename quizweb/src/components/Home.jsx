import { BiWorld } from 'react-icons/bi'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { useState } from 'react'
import { useEffect } from 'react'
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios'
import iziToast from 'izitoast'
import '../assets/css/style.css'
import { Link } from 'react-router-dom'
export default function Home() {

  const [Faq, Setfaq] = useState([])
  const [Testimonial ,SetTestimonial] = useState([])
  const [index, setIndex] = useState()
  const [Image , SetImage] = useState('')
  

  const changeIcon=(ind)=>{
    if(index==ind){
      setIndex()
    }
    else{
      setIndex()
      setIndex(ind)
    }
  }
  
  // faq view api 
  useEffect(() => {
    axios.post(`http://localhost:5000/api/website/faq/view`)
      .then((result) => {
        if (result.data._status == true) {
          Setfaq(result.data._data)
        } else {
          Setfaq([])
        }
      })
      .catch(() => {
        iziToast.error({
          message: 'something went wrong'
        })
      })
  }, [])
  // testimonial view
  useEffect(()=>{
  axios.post(`http://localhost:5000/api/website/testimonial/view`,{
    limit :4
  })
  .then((result)=>{
    if(result.data._status == true){
      SetTestimonial(result.data._data)
      SetImage(result.data.image)
    }else{
      SetTestimonial([])
    }
  })
  .catch(()=>{
    iziToast.error({
          message: 'something went wrong'
        })
      })
  },[])
  
  return (
    <>
      <Header />
      <main className='mains'>
        <div className="Home">
          <div className="homesection">
            {/* <h1>Quiz Up.</h1> */}
            <div className='homesectionimage'>
              {/* hello */}
              <img src='src/assets/images/bg.png' />
            </div>
            <div className='pargraph'>
              <p className='pcontent'>Test Your Knowledge, Challenge the World <BiWorld className='world' />
              </p>
            </div>
          </div>
        </div>
        
        {/*Heading */}
        <div className='userheading'>
          <h2 >What Our Users Say</h2>
        </div>
        {/* testimonial card */}

        <div className='usersay'>
          {
            Testimonial.map((value,index)=>{
              return(
                <div class="testimonial-card" key={index}>
             <img src={`${Image}${value.image}`} class="testimonial-img" />
            <div class="name">{value.name}</div>
            <div class="role">{value.designation}</div>
            <div class="text"> "{value.discription}"
            </div>
            <div class="stars">★★★★★</div>
          </div>
              )
            })
          }
          
        </div>

        {/* frequentley asked question section */}

        <div className='faqouter'>
          <div className='faqheading'>
            <h3>Frequentley Asked Questions</h3>
          </div>
          <div className=' faqs faqinner'>
            <div className=' faqimage'>
              <img src='src\assets\images\faq.png' />
            </div>
            <div className="faqcontent">
              {
                Faq.map((value, ind) => {
                  return (
                    <>
                      <div className='question' key={ind}>
                        <div>
                          {ind + 1} {value.question}
                        </div>
                        <div>
                          <button  onClick={()=>changeIcon(ind)}>
                            {
                              ind==index
                              ?
                                <FaMinus className='faqicons'/>
                                :
                                <FaPlus  className='faqicons'  />
                            }

                          </button>
                        </div>
                      </div>
                      <div className={index==ind ?"answer":"hidden"}  >
                            {value.answer}
                      </div>
                      <hr />
                    </>
                  )
                })
              }
            </div>
          </div>
        </div>
      </main>
      {/* footer */}
      <Footer />
    </>
  )
}
