import React, { useState } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import Sidebar from '../Sidebar'
import { CiFilter } from 'react-icons/ci'
import { MdOutlineDelete } from 'react-icons/md'
import { GrStatusGood } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import { useEffect } from 'react'
import axios from 'axios'
import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast'


export default function Viewfaq() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalpage] = useState([])
  const [faq, Setfaq] = useState([])
  const [seletedrecords, Setselectedrecords] = useState([])
  const [apistatus, Setapistatus] = useState(true)
  const [destroy ,Setdestroy] = useState(true)
  // deleteall
  const Deleteall = () => {
    if(seletedrecords.length > 0){
      axios.put(`http://localhost:5000/api/website/faq/delete`,{
        ids : seletedrecords
      })
      .then((result)=>{
        iziToast.success({
              message : result.data._message
            })
            Setselectedrecords([])
            Setdestroy(!destroy)
      })
      .catch(()=>{
        iziToast.error({
            message: 'something went wrong'
          })
      })
  }
}
  // change status
  const changeStatus = () => {
    if (seletedrecords.length > 0) {
      axios.put(`http://localhost:5000/api/website/faq/changestatus`, {
        ids: seletedrecords,
      })
        .then((result) => {
          if (result.data._status == true) {
            iziToast.success({
              message : result.data._message
            })
            Setselectedrecords([])
            Setapistatus(!apistatus)
            setCurrentPage(1)
          }
        })
        .catch(() => {
          iziToast.error({
            message: 'something went wrong'
          })
        })
    }
  }
  //  view api
  useEffect(() => {
    axios.post(`http://localhost:5000/api/website/faq/view`, {
      page: currentPage,
      limit: 5
    })
      .then((result) => {
        if (result.data._status = true) {
          iziToast.success({
            title: 'sucess',
            message: result.data._message,
            position: 'topCenter'
          })
          Setfaq(result.data._data)
          settotalpage(result.data._paginate.totalpages)
        } else {
          Setfaq([])
        }
      })
      .catch(() => {
        iziToast.error({
          title: 'error',
          message: 'something went wrong',
          position: 'topCenter'
        })
      })
  }, [currentPage, apistatus ,destroy])
  // all select
  const allselect = () => {
    // allchecked box unchecked fun
    if (faq.length == seletedrecords.length) {
      Setselectedrecords([])
    } else {
      // allunchecked box checked fun
      var data = []
      faq.forEach((v) => {
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
                FAq
              </li>
              <li>
                /
              </li>
              <li>
                view
              </li>
            </ul>
          </div>
          <div className="filterouter">
            <div className='filterinner'>
              <button
                className='deletebtn'
                onClick={Deleteall}
                disabled={seletedrecords.length == 0}
              ><MdOutlineDelete className='delete' /> Delete All </button>
              <button
                className='deletebtn'
                onClick={changeStatus}
                disabled={seletedrecords.length == 0?true:false}
              ><GrStatusGood />  Change Status </button>
            </div>
          </div>
          <table>
            {/* table haeding start */}
            <thead>
              <tr>
                <th >
                  <input
                    type='checkbox'
                    checked={seletedrecords.length > 0 ? seletedrecords.length == faq.length ? true : false : false}
                    onClick={allselect}
                  />
                  select
                </th>
                <th className='faqquestion' >
                  Question
                </th>
                <th className='faqanswer' >
                  Answer
                </th>
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
                faq.length > 0
                  ?
                  faq.map((value, index) => {
                    return (
                      <>
                        <tr key={index}>
                          {/* row 1 start */}
                          <td >
                            <input
                              type='checkbox'
                              onClick={() => singlecheck(value._id)}
                              checked={seletedrecords.includes(value._id)?true:false}
                            />
                          </td>
                          <td>
                            {value.question}
                          </td>
                          <td >
                            {value.answer}
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
                            <Link to = {`/faq/update/${value._id}`}>
                             <FaRegEdit className='editicon' />
                            </Link>
                          </td>
                        </tr>
                      </>
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
