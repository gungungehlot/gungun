import axios from "axios";
import { useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { ImProfile } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {


  const [category, setCategory] = useState([])
  const navigate = useNavigate();

  // quiz category

  const Idselect = (e)=>{
    const id = e.target.value
    console.log('id',id)
    navigate(`/Quiz/${id}`);
  }

  useEffect(() => {
    axios.post(`http://localhost:5000/api/admin/topic/view`, {
      limit: 6
    })
      .then((result) => {
        if (result.data._status == true) {
          setCategory(result.data._data)
        } else {
          setCategory([])
        }
      })
      .catch(() => {
        iziToast.error({
          message: 'Something went wrong'
        })
      })
  }, [])
  return (
    <main className="main">
      <header className="header">
        <a href="#" className="logo">QuizUp</a>

        <navbar className='navbar'>
          <Link to={`/`}>
            Home
          </Link>
          <Link to={`/service`}>
            Services
          </Link>
          <Link to={'/profile'} >
            My-Profile
          </Link>
            <select name='topicid' onChange={Idselect} > Quiz Topic
              <option value=''>Quiz Topic</option>
              {
                category.map((value, index) => {
                  return (
                    <option value={value._id}  key={index}>{value.name}</option>
                  )
                })
              }
            </select>
        </navbar>
        <Link to={`/login`} className="login-register">
          <CiUser />
          Login/Register
        </Link>
      </header>
    </main>
  )
}
