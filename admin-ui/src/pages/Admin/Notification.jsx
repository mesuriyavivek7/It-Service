import { LoaderCircle, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

//Importing images
import NOMESSAGE from '../../assets/no-message.png'
import { toast } from 'react-toastify'
import api from '../../api'
import socket from '../../socket'


const getIssueType = (notification) =>{
    switch(notification.type){
      case "issue_created":
        return "New Issue created."

      case "assign_issue":
        return "Issue assigned to employee."

      case "start_working_issue":
        return "Employee start working on issue."

      case "complete_issue":
        return "Issue Resolved."
      
      case "create_leave":
        return "New Leave created."

      case "approve_leave":
        return "Leave approved."

      case "reject_leave":
        return "Leave Rejected."
    }
}

const formateDate = (date) =>{
  let d = new Date(date)
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return d.toLocaleDateString('en-GB', options);
}

const getTimeAgo = (date) =>{
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const unit of units) {
    const value = Math.floor(diffInSeconds / unit.seconds);
    if (value > 0) {
      return `${value} ${unit.label}${value > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

function Notification({setOpenNotification,notification,setNotification,openNotification}) {
  const {user} = useSelector((state)=>state.auth)
  
  const [loading,setLoading] = useState(false) 

  const fetchNotifications = async () =>{
    setLoading(true)
    try{
       const response = await api.get('notify')
       setNotification(response.data.data)
    }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
    }finally{
        setLoading(false)
    }
  }

  useEffect(()=>{
    fetchNotifications()

    if(user?.userId){
        socket.emit('join_room',`${user?.userType}_${user?.userId}`)
    }

    socket.on('issue_created', (data)=> {
        setNotification(prev => [data.notification, ...prev])
    })
    
    return () => {
        socket.off('issue_created')
    }
    
  },[user])  

  console.log(notification)

  return (
    <div className={`rounded-md transition-all duration-300 z-50 w-72  bg-white h-10/12 ${openNotification?"right-2":"-right-72"} md:top-22 shadow-lg top-16 absolute`}>
       <div className='flex p-4 border-b border-neutral-200 justify-between items-center'>
         <h1 className='font-medium'>Notifications</h1>
         <X onClick={()=>setOpenNotification(false)} className='text-gray-600 cursor-pointer hover:text-red-500 transition-colors duration-300 w-5 h-5'></X>
       </div>
       <div className='overflow-auto p-2 w-full h-11/12'>
        {
            loading ? 
            <div className='h-full w-full flex justify-center items-center'>
                 <LoaderCircle className='animate-spin'></LoaderCircle>
            </div>
            : (notification.length > 0 ) ?
              notification.map((item,index)=>(
              <div key={index} className='flex border-b mb-1 border-neutral-200 p-2 flex-col gap-2'>
                <div className='flex flex-col'>
                    <h1 className='font-medium text-sm'>{getIssueType(item)}</h1>
                     <div className='flex items-center justify-between'>
                        <span className='text-neutral-400 text-xs'>{formateDate(item.createdAt)}</span>
                        <span className='text-neutral-400 text-xs'>{getTimeAgo(item.createdAt)}</span>
                     </div>
                </div>
                <div className='bg-slate-200 text-sm p-2 rounded-md'>
                   {item.message}
                </div>
                <div className='w-full place-content-start items-center'>
                    <button className='text-sm hover:bg-blue-600 transition-colors duration-300 py-1 px-2 bg-blue-500 cursor-pointer rounded-md text-white'>Mark As Read</button>
                </div>
               </div>
              ))
            : <div className='w-full h-full flex justify-center items-center'>
                <div className='flex flex-col items-center gap-2'>
                  <img src={NOMESSAGE} className='w-15 h-15'></img>
                  <span className='font-light text-sm'>No Messages</span>
                </div>
              </div>
        }
        


       </div>
    </div>
  )
}

export default Notification