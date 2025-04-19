import React, { useEffect, useState } from 'react'

//Importing icons
import { Calendar, LoaderCircle, Search } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import { MessageCircle } from 'lucide-react';
import { Clock } from 'lucide-react';


import { toast } from 'react-toastify';
import api from '../../api';

const getBgColor = (status) =>{
    switch(status){
       case "Pending":
         return "orange-200"
       case "Approved":
        return "green-100"
       case "Rejected":
        return "red-100"
    }
}

const getTextColor = (status) =>{
    switch(status){
        case "Pending":
          return "orange-500"
        case "Approved":
         return "green-500"
        case "Rejected":
         return "red-500"
     }
}

const formatDateToLong = (dateInput) => {
  if(!dateInput) return ''
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}

const getDaysBetweenDates = (fromDate, toDate) => {
  const from = new Date(fromDate);
  const to = new Date(toDate);

  // Get the difference in time (milliseconds)
  const diffTime = Math.abs(to - from);

  // Convert milliseconds to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

function Leave() {

    const [leaves,setLeaves] = useState([])
    const [filteredLeaves,setFilteredLeaves] = useState([])
    const [loading,setLoading] = useState(false)
    const [leaveType,setLeaveType] = useState('')
    const [searchQuery,setSearchQuery] = useState('')


    const fetchData = async () =>{
        setLoading(true)
        try{ 
          const response = await api.get(`leave?leaveType=${leaveType}`)
          setLeaves(response.data.data)
        }catch(err){
            console.log(err)
            toast.error(err?.response?.data?.message || "Something went wrong.")
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
      if(searchQuery){
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = leaves.filter((book) =>
        Object.values(book).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseQuery)
         )
        );
        setFilteredLeaves(filtered);
      }else{
        setFilteredLeaves(leaves)
      }

    },[searchQuery,leaves])

    const handleApproveLeave = async (id) =>{
      try{
         const response = await api.post(`/leave/approve/${id}`)
         fetchData()
         toast.success("Leave approved sucessfully.")
      }catch(err){
         console.log(err)
         toast.error(err?.response?.data?.message || "Something went wrong.")
      }
    }

    const handleRejectLeave = async (id) =>{
      try{
        const response = await api.post(`leave/reject/${id}`)
        fetchData()
        toast.success("Leave rejected successfully.")
      }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
      }
    }

    useEffect(()=>{
       fetchData()
    },[leaveType])

  return (
    <div className='flex w-full h-full flex-col gap-4'>
        <div className='bg-white flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
        <div>
          <select onChange={(e)=>setLeaveType(e.target.value)} value={leaveType} className='border py-1.5 px-2 outline-none rounded-md border-grayborder'>
            <option value={''}>All Leaves</option>
            <option value={'Approved'}>Approved Leaves</option>
            <option value={'Pending'}>Pending Leaves</option>
            <option value={'Rejected'}>Rejected Leaves</option>
          </select>
        </div>

        <div className='flex items-center gap-2'>
            <div className='flex border border-grayborder md:w-auto w-36 gap-2 rounded-md py-1.5 px-2 items-center'>
                <Search className='w-5 h-5 text-navtext'></Search>
                <input onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} className='outline-none placeholder:text-navtext placeholder:text-sm' placeholder='Search Leaves...'></input>
            </div>
            <div onClick={fetchData} className='py-2 px-2 border-grayborder border rounded-md'>
                <RefreshCcw className='w-5 h-5 cursor-pointer'></RefreshCcw>
            </div>
        </div>
        </div>

      <div className='w-full h-full overflow-scroll flex flex-col gap-2'>

          {
            loading ? 
             <div className='flex w-full h-full justify-center items-center'>
                 <LoaderCircle className='animate-spin w-8 h-8 text-blue-500'></LoaderCircle>
             </div>
             : filteredLeaves.length === 0?
             <div className='flex w-full h-full justify-center items-center'>
               <span>No Leaves Found.</span>
             </div>
             :
             filteredLeaves.map((leave,index) =>(
              <div key={index} className={`p-4 bg-white shadow flex flex-col gap-2 w-full border-r-4 border-l-4 border-t border-b rounded-md border-${getTextColor(leave.status)}`}>
                <div className='flex md:flex-row flex-col justify-between items-start gap-2 md:items-center'>
                   <div className='flex gap-4 items-center'>
                       <h1 className='text-lg font-medium'>{leave.leave_type}</h1>
                       <span className={`border text-sm border-${getTextColor} bg-${getBgColor(leave.status)} py-.5 rounded-2xl px-2 text-${getTextColor(leave.status)}`}>
                          {leave.status}
                       </span>
                   </div>
                   <div className='flex items-center gap-2'>
                      <Calendar className='w-5 h-5'></Calendar>
                      <div className='flex text-[15px] items-center gap-1.5'>
                        <span>{formatDateToLong(leave.from)}</span>
                        <span>to</span>
                        <span>{formatDateToLong(leave.to)}</span>
                        <span>({getDaysBetweenDates(leave.from,leave.to)} days)</span>
                      </div>
                   </div>
                </div>
                <div className='flex justify-between items-end'>
                 <div className='flex w-full flex-col gap-2'>
                   <div className='flex w-full gap-2 items-center'>
                      <MessageCircle className="w-5 h-5"></MessageCircle>
                      <p className='text-sm'>{leave?.comments}</p>
                   </div>
                   <div className='flex gap-2 items-center'>
                       <Clock className='text-neutral-400 w-4 h-4'></Clock>
                      <span className='text-sm text-neutral-400'>Requested On: {formatDateToLong(leave.createdAt)}</span>
                   </div>
                 </div>
                 {
                  leave.status === "Pending" &&
                  <div className='flex items-center gap-2'>
                  <button onClick={()=>handleRejectLeave(leave._id)} className='text-red-500 cursor-pointer hover:text-white hover:bg-red-500 transition-colors duration-300 bg-red-100 py-1 w-24 border border-red-500 rounded-md'>
                     Reject
                  </button>
                  <button onClick={()=>handleApproveLeave(leave._id)} className='text-green-500 cursor-pointer hover:text-white hover:bg-green-500 transition-colors duration-300 bg-green-100 py-1 w-24 border border-green-500 rounded-md'>
                     Approve
                  </button>
               </div>
                 }
                </div>
            </div>
             ))
          }

          

      </div>

    </div>
  )
}

export default Leave