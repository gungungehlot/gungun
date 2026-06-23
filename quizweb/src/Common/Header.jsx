import axios from "axios";
import { useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { ImProfile } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import Cookies from 'js-cookie'
import iziToast from 'izitoast'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/loginslice'

export default function Header() {


  const [category, setCategory] = useState([])
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = Cookies.get('user_token');

  // quiz category
  const Idselect = (e) => {
    const id = e.target.value
    console.log('id', id)
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
  // logout 
  const Logoutadmin = () => {
    Cookies.remove('user_token');
    dispatch(logout())
    var cookies = Cookies.get('user_token')
    if (cookies == '' || cookies == undefined) {
      iziToast.success({
        message: 'Sucess'
      })
      navigate('/login')
    }
  }
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
                  <option value={value._id} key={index}>{value.name}</option>
                )
              })
            }
          </select>
        </navbar>
        {
          token
            ?
            <button className="logoutuser login-register" onClick={Logoutadmin}>
              <FiLogOut /> Logout
            </button>
            :
            <Link to={`/login`} className="login-register">
              <CiUser />
              Login/Register
            </Link>
        }
        {/* <Link to={`/login`} className="login-register">
          <CiUser />
          Login/Register
        </Link> */}
        {/* <button className="logoutuser login-register" onClick={Logoutadmin}>
          <FiLogOut /> Logout
        </button> */}
      </header>
    </main>
  )
}
