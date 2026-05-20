import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { Link } from 'react-router-dom'
import { MdAdminPanelSettings, MdFilterAlt, MdFilterAltOff, MdOutlineDelete } from 'react-icons/md'
import { GrStatusGood } from 'react-icons/gr'
import { FaRegEdit } from 'react-icons/fa'
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import axios from 'axios'
import { BiPlus, BiUser } from 'react-icons/bi'
import { IconContext } from 'react-icons'
import iziToast from 'izitoast'

export default function Admin() {
    const [filter, setfilter] = useState('')
    const [filterelement, setfilterelement] = useState([])
    const [admin, setadmin] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalpage] = useState()
    const [seletedrecords, Setselectedrecords] = useState([])
    const [Image, Setimage] = useState('')
    const [api, setApi] = useState(true)
    const [destroy, setDestory] = useState(true)

    const Deleteall = () => {
        if (seletedrecords.length > 0) {
            axios.put(`http://localhost:5000/api/admin/user/delete`, {
                id: seletedrecords
            })
                .then((result) => {
                    if (result.data._status === true) {
                        iziToast.success({
                            message: result.data._mesage
                        })
                        setDestory(!destroy)
                        setCurrentPage(1)
                        Setselectedrecords([])
                    }
                })
                .catch(() => {
                    iziToast.error({
                        message: "no"
                    })
                })
        }
    }


    const Changestatus = () => {
        if (seletedrecords.length > 0) {
            axios.put(`http://localhost:5000/api/admin/user/changestatus`, {
                ids: seletedrecords
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

    // filter function
    const filterfun = (e) => {
        e.preventDefault();
        let item = {
            name: e.target.name.value
        }
        setfilterelement(item)
        console.log(item)
    }

    // all check box select function
    const allselect = () => {
        // allchecked box unchecked fun
        if (admin.length == seletedrecords.length) {
            Setselectedrecords([])
        } else {
            // allunchecked box checked fun
            var data = []
            admin.forEach((v) => {
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
        axios.post(`http://localhost:5000/api/admin/user/view`, {
            limit: 10,
            page: currentPage,
            name: filterelement.name
        })
            .then((result) => {
                if (result.data._status == true) {
                    setadmin(result.data._data)
                    setTotalpage(result.data._paginate.totalpages)
                    Setimage(result.data.image)
                    console.log(result.data._data)
                } else {
                    setadmin([])
                }
            })
            .catch(() => {
                iziToast.error({
                    message: 'Something went wrong'
                })
            })
    }, [filterelement, currentPage, api, destroy])
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
                                Admin
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
                                disabled={seletedrecords.length == 0}
                            ><MdOutlineDelete className='delete' /> Delete All </button>
                            <button
                                className='deletebtn'
                                onClick={Changestatus}
                                disabled={seletedrecords.length == 0}
                            ><GrStatusGood />  Change Status </button>
                        </div>
                        {/* redirect toadmin page  */}
                        <div className='createadmin'>
                            <div className='adminbtn'>
                                <Link to={'/usermangement/admin/createadmin'}>
                                    <button>Create admin </button>
                                </Link>
                            </div>
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
                                            <label>Enter Admin Name </label>
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
                                        checked={seletedrecords.length > 0 ? seletedrecords.length == admin.length ? true : false : false}
                                        onClick={allselect}
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
                                    Image
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
                                admin.length > 0
                                    ?
                                    admin.map((value, index) => {
                                        console.log(value.image)
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
                                                    <Link to={`/usermangement/admin/update/${value._id}`}>
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
                            {/*row 1 end  */}

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
