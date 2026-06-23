import React, { useEffect } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import Sidebar from '../Sidebar'
import { Link } from 'react-router-dom'
import { MdFilterAlt, MdFilterAltOff, MdOutlineAutoDelete } from 'react-icons/md'
import { GrStatusGood } from 'react-icons/gr'
import iziToast from 'izitoast'
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import axios from 'axios'
import { useState } from 'react'
import Cookies from 'js-cookie'

export default function Viewquiz() {
  const [filter, setfilter] = useState(true)
  const [seletedrecords, Setselectedrecords] = useState([])
  const [api, Setapistatus] = useState(true)
  const [destroy, Setdestroy] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, Settotalpages] = useState([])
  const [Image, Setimage] = useState('')
  const [quiz, Setquiz] = useState([])
  const [filterelemnet, setfilterelement] = useState({})


  const Deleteall = () => {
    if (seletedrecords.length > 0) {
      axios.put('http://localhost:5000/api/website/quiz/delete', {
    id: seletedrecords
}, {
    headers: { Authorization: `Bearer ${Cookies.get('admin_token')}` }
})
        .then((result) => {
          if (result.data._status == true) {
            iziToast.success({
              message: result.data._message
            })
            Setdestroy(!destroy)
            Setselectedrecords([])
          }
        })
        .catch(() => {
          iziToast.error({
            message: 'Something went wrong'
          })
        })
    }
  }

  const Changestatus = () => {
    if (seletedrecords.length > 0) {
      axios.put(`http://localhost:5000/api/website/quiz/changestatus`, {
        id: seletedrecords
      },
    {
    headers: { Authorization: `Bearer ${Cookies.get('admin_token')}` }
})
        .then((result) => {
          if (result.data._status == true) {
            iziToast.success({
              message: result.data._message
            })
            Setapistatus(!api)
            Setselectedrecords([])
          }
        })
        .catch(() => {
          iziToast.error({
            message: 'Something went wrong'
          })
        })
    }
  }

  const filterfun = (e) => {
    e.preventDefault();

    let item = {
      name: e.target.name.value
    }
    setfilterelement(item)
    console.log(item)
  }

  const allselect = () => {
    // allchecked box unchecked fun
    if (quiz.length == seletedrecords.length) {
      Setselectedrecords([])
    } else {
      // allunchecked box checked fun
      var data = []
      quiz.forEach((v) => {
        data.push(v._id);
      })
      Setselectedrecords([...data])
      console.log([...data])
    }
    // console.log([...data])
  }
  //  single checkfunction
  //single checked select and get id and save id in state
  const singlecheck = (id) => {
    // console.log(id)
    if (seletedrecords.includes(id)) {
      var finalresponse = seletedrecords.filter((v) => {
        if (v != id) {
          return v
        }
      })
      Setselectedrecords(finalresponse)
    } else {
      var finalresponse = [...seletedrecords, id]
      Setselectedrecords(finalresponse)
    }

  }

  // view api
  useEffect(() => {
    axios.post(`http://localhost:5000/api/website/quiz/view`, {
      page: currentPage,
      name: filterelemnet.name,
      limit: 4
    })
      .then((result) => {
        if (result.data._status == true) {
          Setquiz(result.data._data)
          console.log(result.data._data)
          Settotalpages(result.data._paginate.totalpages)
          Setimage(result.data.image)
          iziToast.success({
            message: result.data._message
          })
        } else {
          Setquiz([])
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
  }, [currentPage, filterelemnet, destroy, api])
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
              <li>
                Testimonial
              </li>
              <li>
                /
              </li>
              <li>
                View
              </li>
            </ul>
          </div>
          <div className="filterouter">
            <div className='filterinner'>
              <button
                className='deletebtn'
                onClick={() => setfilter(!filter)}
              >{
                  filter
                    ?
                    <MdFilterAltOff className='delete' />
                    :
                    <MdFilterAlt className='delete' />
                }

              </button>

              <button
                className='deletebtn'
                onClick={Deleteall}
                disabled={seletedrecords.length == 0}
              >
                <MdOutlineAutoDelete
                  className='delete'
                /> Delete All </button>
              <button
                className='deletebtn'
                onClick={Changestatus}
                disabled={seletedrecords.length == 0}
              ><GrStatusGood />  Change Status </button>
            </div>
            {(filter &&
              // filter function start
              <form
                onSubmit={filterfun}
                className='filterform'>
                <p>Filter</p>
                <div className='filterforminner'>
                  <div className='filter '>
                    <div className='filterlabel' >
                      <label>Enter Name </label>
                    </div>
                    <div className="filterinput">
                      <input
                        type='text'
                        name='name'
                        placeholder='Enter  name'
                      />
                    </div>
                  </div>
                </div>
                <div className='applybtn'>
                  <button
                    type='reset'
                    onClick={() => setfilterelement({})}
                    className='filterclear'>
                    Clear
                  </button>
                  <button
                    type='submit'
                    className='filterclear'>
                    Apply
                  </button>
                </div>
              </form>
              // filter function end 
            )}
          </div>
          <table>
            {/* table haeding start */}
            <thead>
              <tr>
                <th >
                  <input
                    type='checkbox'
                    checked={seletedrecords.length > 0 ? seletedrecords.length == quiz.length ? true : false : false}
                    onClick={allselect}
                  />
                  select
                </th>
                <th >
                  Quiz name
                </th>
                <th >
                  topic name
                </th>
                <th >
                  Image
                </th>
                {/* <th >
                 Discription
                </th> */}
                <th>
                  status
                </th>
                <th>
                  action
                </th>
              </tr>
            </thead>
            {/* table haeding end */}
            <tbody>
              {/* table body start */}
              {
                quiz.length > 0
                  ?
                  quiz.map((value, index) => {
                    return (
                      <tr className='bg-white border-b ' key={index}>
                        {/* row 1 start */}
                        <td className='mr-3 py-5 px-2'>
                          <input
                            type='checkbox'
                            onClick={() => singlecheck(value._id)}
                            checked={seletedrecords.includes(value._id) ? true : false}
                          />
                        </td>
                        <td>
                          {value.name}
                        </td>
                        <td>
                          {value.topicid.name}
                        </td>
                        <td>
                          {
                            value.image
                              ?
                              <img src={`${Image}${value.image}`} width={100} />
                              :
                              "  N/A"
                          }
                        </td>
                        <td>
                          {
                            value.status == 1
                              ?
                              <span className='active'>Active</span>
                              :
                              <span className='inactive'>Inactive</span>
                          }
                        </td>
                        <td>
                          <Link to={`/quiz/update/${value._id}`}>
                            <FaRegEdit className='editicon' />
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                  :
                  <tr>
                    <td colSpan={6} className="norecord">no record found</td>
                  </tr>
              }
              {/* table body end */}
            </tbody>
            {/* table end */}
          </table>
          <div className='pagination'>
            <ResponsivePagination
              current={currentPage}
              total={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  )
}
