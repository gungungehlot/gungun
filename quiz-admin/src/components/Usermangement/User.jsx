import { Link, Outlet } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { MdFilterAlt, MdFilterAltOff, MdOutlineDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { GrStatusGood } from "react-icons/gr";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import Sidebar from "../Sidebar";
import axios from "axios";
import iziToast from "izitoast";

export default function User() {
  const [filter, setfilter] = useState(true)
  const [filterelement, setfilterelement] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState([])
  const [Image, Setimage] = useState('')
  const [seletedrecords, Setselectedrecords] = useState([])
  const [totalPages, setTotalpage] = useState()
  const [destroy, Setdestroy] = useState(true)
  const [api, setApi] = useState(true)

  const Deleteall = () => {
    if (seletedrecords.length > 0) {
      axios.put(`http://localhost:5000/api/website/user/delete`, {
        id: seletedrecords
      })
        .then((result) => {
          if (result.data._status == true) {
            iziToast.success({
              message: result.data._message
            })
            Setselectedrecords([])
            setCurrentPage(1)
            setApi(!api)
          }
        })
        .catch(() => {
          iziToast.error({
            message: 'something went wrong'
          })
        })
    }
  }

  const Changestatus = () => {
    if (seletedrecords.length > 0) {
      // console.log(seletedrecords.)
      axios.put(`http://localhost:5000/api/website/user/changestatus`, {
        ids: seletedrecords
      })
        .then((result) => {
          console.log(result)
          if (result.data._status == true) {
            iziToast.success({
              message: result.data._message
            })
             setApi(!api)
            setCurrentPage(1)
            Setselectedrecords([])
          }else{
            iziToast.error({
              message : result.data._message
            })
          }
        })
        .catch(() => {
          iziToast.error({
            message: 'something went wrong'
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
  }

  // all check box select function
  const allselect = () => {
    // allchecked box unchecked fun
    if (user.length == seletedrecords.length) {
      Setselectedrecords([])
    } else {
      // allunchecked box checked fun
      var data = []
      user.forEach((v) => {
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
    axios.post(`http://localhost:5000/api/website/user/view`, {
      name: filterelement.name,
      page: currentPage,
      limit: 7
    })
      .then((result) => {
        if (result.data.status == true) {
          setUser(result.data._data)
          setTotalpage(result.data._paginate.totalpages)
          Setimage(result.data.image)
          console.log(result.data._data)
        } else {
          setUser([])
        }
      })
      .catch(() => {
        iziToast.error({
          message: 'something went wrong'
        })
      })
  }, [currentPage, filterelement, destroy, api])
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
                User-Mangemant
              </li>
              <li>
                /
              </li>
              <li>
                User
              </li>
            </ul>
          </div>
          <div className="filterouter">
            <div className='filterinner'>
              <button
                className='deletebtn'
                onClick={() => setfilter(!filter)}
              >
                {
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
              ><MdOutlineDelete className='delete' /> Delete All </button>
              <button
                className='deletebtn'
                onClick={Changestatus}
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
                      <input type='text'
                        name='name'
                        placeholder='Enter  name'
                      />
                    </div>
                  </div>
                </div>
                <div className='applybtn'>
                  <button
                    onClick={() => setfilterelement({})}
                    type='reset'
                    className='filterclear clear'>
                    Clear
                  </button>
                  <button
                    type='submit'
                    className='filterclear apply'>
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
                    onClick={allselect}
                    checked={seletedrecords.length > 0 ? seletedrecords.length == user.length ? true : false : false}
                  />
                  select
                </th>
                <th >
                  name
                </th>
                <th >
                  Email
                </th>
                <th >
                  Mobile-No
                </th>
                <th >
                  Image
                </th>
                <th>
                  status
                </th>
                {/* <th>
                  action
                </th> */}
              </tr>
            </thead>
            {/* table haeding end */}
            <tbody>
              {/* table body start */}
              {
                user.length > 0
                  ?
                  user.map((value, index) => {
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
                          {value.email}
                        </td>
                        <td>
                          {value.mobile_number}
                        </td>
                        <td>
                          {
                            value.image
                              ?
                              <img src={`${Image}${value.image}`} width={100} />
                              :
                            'N/A'
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
                        {/* <td>
                          <Link to={`update/${value._id}`}>
                            <FaRegEdit className='editicon' />
                          </Link>
                        </td> */}
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
