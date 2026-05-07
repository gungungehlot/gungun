import React, { useEffect, useState } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import Sidebar from '../Sidebar'
import { Link } from 'react-router-dom'
import { CiFilter } from 'react-icons/ci'
import { GrStatusGood } from 'react-icons/gr'
import { MdFilterAlt, MdFilterAltOff, MdOutlineAutoDelete, MdOutlineFilter } from 'react-icons/md'
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';
import axios from 'axios'
import iziToast from 'izitoast'
import { FaFile } from 'react-icons/fa6'
import { AiOutlineFilter } from 'react-icons/ai'

export default function Viewtopic() {
  const [filter , setfilter] = useState(true)
      const [seletedrecords, Setselectedrecords] = useState([])
      const [Topic , Settopic] = useState ([])
      const [filterelement, setfilterelement] = useState({})
      const [api , Setapistatus] = useState(true)
      const [destroy , Setdestroy] = useState(true)
      const [currentPage, setCurrentPage] = useState(1);
      const [totalPages , Settotalpages] = useState([])
      const filterfun = (e)=>{
        e.preventDefault();
        let item = {
        name : e.target.name.value
        }
         setfilterelement(item)
        console.log(item)
    }
     const allselect = () => {
    // allchecked box unchecked fun
    if (Topic.length == seletedrecords.length) {
      Setselectedrecords([])
    } else {
      // allunchecked box checked fun
      var data = []
      Topic.forEach((v) => {
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
  // change status
  const Changestatus= () =>{
    if(seletedrecords.length > 0){
      axios.put(`http://localhost:5000/api/admin/topic/changestatus`,{
        id:seletedrecords
      })
      .then((result)=>{
        if(result.data._status == true){
          iziToast.success({
            message : result.data._message
          })
          Setselectedrecords([])
          Setapistatus(!api)
        }
      })
      .catch(()=>{
        iziToast.error({
          message : 'something went wrong'
        })
      })
    }
  }

  // delete api
  const Deleteall = ()=>{
    if(seletedrecords.length > 0){
      axios.put(`http://localhost:5000/api/admin/topic/delete`,{
        id: seletedrecords
      })
      .then((result)=>{
        if(result.data._status == true){
         iziToast.success({
          message : result.data._message
         }) 
         Setselectedrecords([])
         setCurrentPage(1)
         Setdestroy(!destroy)
        }
      })
    }
  }
  // view api topic 
  useEffect(()=>{
axios.post(`http://localhost:5000/api/admin/topic/view`,{
  page :currentPage,
  limit : 5,
  name : filterelement.name
})
    .then((result)=>{
      if(result.data._status  == true){
        Settopic(result.data._data)
        Settotalpages(result.data._paginate.totalpages)
        iziToast.success({
          message : result.data._message
        })
      }else{
        Settopic([])
      }
    })
    .catch(()=>{
      iziToast.error({
        message : 'Something went wrong'
      })
    })
  },[currentPage,filterelement,api,destroy])
  return (
   <>
           <div class='usermain'>
             <Sidebar/>
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
                    Topic
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
                 <div className= 'filterinner'>
                    <button
                       className='deletebtn'
                       onClick={()=>setfilter(!filter)}
                       >
                        {
                      filter
                      ?
                      <MdFilterAltOff className= 'delete'/>
                      :
                      <MdFilterAlt className= 'delete'/> 
                    }
                     </button>  
   
                   <button
                    className= 'deletebtn'
                      onClick={Deleteall}
                     disabled = {seletedrecords.length == 0}
                    >    
                   <MdOutlineAutoDelete
                    className= 'delete'
                    /> Delete All </button>
               <button
               className='deletebtn'
              onClick={Changestatus}
               disabled = {seletedrecords.length == 0}
               ><GrStatusGood/>  Change Status </button>
                   </div>
                           {(filter&&
                           // filter function start
                               <form 
                                 onSubmit={filterfun}
                                className='filterform'>
                                           <p>Filter</p>
                                           <div className= 'filterforminner'>
                                           <div className='filter '> 
                                             <div className= 'filterlabel' >
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
                                         <div className= 'applybtn'>
                                           <button
                                            type='reset'
                                            onClick={()=>setfilterelement({})}
                                             className='filterclear'>
                                               Clear
                                               </button>
                                           <button 
                                           type='submit'  
                                           className='filterclear'>
                                             Filter
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
                 checked = {seletedrecords.length > 0 ? seletedrecords.length == Topic.length ? true : false : false}
                 onClick={allselect}
                 />
                 select
               </th>
               <th >
                 name
               </th>
               <th >
                 Order
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
           Topic.length > 0
           ?
           Topic.map((value,index)=>{ 
                    return( 
                            <tr className='bg-white border-b ' key={index}>
           {/* row 1 start */}
         <td  className='mr-3 py-5 px-2'>
          <input 
          type='checkbox'  
           onClick={() => singlecheck(value._id)}
           checked={seletedrecords.includes(value._id)?true:false}    
          /> 
         </td>
           <td>      
         {value.name}
         </td>
         <td>
          {value.order}
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
           <Link to = {`/topic/update/${value._id}`}>
           <FaRegEdit className='editicon'/>
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
