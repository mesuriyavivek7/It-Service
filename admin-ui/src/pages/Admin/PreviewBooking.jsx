import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AssignEmployee from '../../components/AssignEmployee';

//importing icons
import { Laptop, LoaderCircle } from 'lucide-react';
import { Wrench } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { Clock } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Image } from 'lucide-react';
import { User } from 'lucide-react';
import { UserCog } from 'lucide-react';
import { Ellipsis } from 'lucide-react';



//Importing images
import ONSITE from '../../assets/onsite.png'
import REMOTE from '../../assets/remote.png'
import LAPTOP from '../../assets/IMG_0249.jpeg'
import USER from '../../assets/user.png'
import EMPLOYEE from '../../assets/employee.png'
import { toast } from 'react-toastify';
import api from '../../api';


function PreviewBooking() {
    const location = useLocation()
    const [issueDetails,setIssueDetails] = useState(location?.state)
    const [cancelLoader,setCancelLoader] = useState(false)
    const [removeLoader,setRemoveLoader] = useState(false)
    const [openPreviewBox,setOpenPreviewBox] = useState(false)

    const navigate = useNavigate()

    useEffect(()=>{
      if(!location.state) navigate('/')
    },[])
 
    const fetchData = async ()=>{
      try{
        const response = await api.get(`issue/getoneForAdmin/${location.state._id}`)
        setIssueDetails(response.data.data)
      }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
      }
    }

    const getStatusStyle = (status) =>{
        switch(status){
          case 'Resolved':
            return "bg-green-500"
              
          case 'Canceled':
            return "bg-red-500"
    
          case 'Pending':
            return "bg-yellow-500"
    
          default:
            return "bg-blue-500"
    
        }
    }

    const formatDate= (timestamp) => {
      const date = new Date(timestamp);
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      return `${day}, ${month} ${year}`;
  }


  const handleRemoveEmployee = async () =>{
    try{
      setRemoveLoader(true)
      console.log(issueDetails)
      let Obj = {
       issueId:issueDetails._id,
       employeeId:issueDetails.assignedEmployee._id
      }
      const response = await api.post('employee/removeEmployeeFromIssue',Obj)
      await fetchData()
      toast.success("Successfully employee removed from booking.")
    }catch(err){
     console.log(err)
     toast.error(err?.response?.data?.message || "Something went wrong.")
    }finally{
      setRemoveLoader(false)
    }
  }


  const handleCancelIssue = async () =>{
    setCancelLoader(true)
    try{
      const response = await api.post(`issue/cancelissue/${issueDetails._id}`)
      await fetchData()
      toast.success("Issue canceled successfully")
    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }finally{
      setCancelLoader(false)
    }
  }

  const handleCloseBookingPreview = () =>{
    fetchData()
    setOpenPreviewBox(false)
  }

  return (
    <div className='flex w-full h-screen flex-col gap-6'>
        {
          openPreviewBox &&
          <AssignEmployee issueData={issueDetails} handleCloseBookingPreview={handleCloseBookingPreview}></AssignEmployee>
        }
        <div className='flex bg-white rounded-md justify-between items-center shadow-[0_2px_10px_rgba(0,0,0,0.08)] p-4'>
            <h1 className='text-xl font-semibold'>Booking Details</h1>
            <span className={`${getStatusStyle(issueDetails.status)} text-white p-1.5 rounded-md`}>{issueDetails.status}</span>
        </div>
        <div className='flex w-full md:flex-row flex-col h-full gap-6 items-start'>

            {/* Left sections */}
            <div className='md:w-[60%] w-full h-full flex flex-col gap-6'>

               <div className='flex bg-white flex-col rounded-md border-l-3 border-red-500 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
                 <div className='bg-gradient-to-r p-4 from-red-200 to-red-50'>
                    <h1 className='text-lg font-semibold'>Issue Description</h1>
                 </div>
                 <div className='p-4'>
                    <p className='font-sans'>{issueDetails.issue_description || ""}</p>
                 </div>
               </div>

               <div className='flex bg-white flex-col rounded-md border-l-3 border-blue-500 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
                 <div className='bg-gradient-to-r flex justify-between p-4 from-blue-200 to-blue-50'>
                    <h1 className='text-lg font-semibold'>Device Information</h1>
                    <Laptop className='text-blue-500'></Laptop>
                 </div>
                 <div className='p-4 grid grid-cols-2 gap-4'>
                   <div className='flex flex-col'>
                     <span className='font-medium'>Device Type</span>
                     <span className='text-gray-500'>{issueDetails?.device?.device_type || ""}</span>
                   </div>
                   <div className='flex flex-col'>
                    <span className='font-medium'>Brand</span>
                    <span className='text-gray-500'>{issueDetails?.device?.brand || ""}</span>
                   </div>
                   <div className='flex flex-col'>
                    <span className='font-medium'>Model Number</span>
                    <span className='text-gray-500'>{issueDetails?.device?.model_number || ""}</span>
                   </div>
                   <div className='flex flex-col'>
                    <span className='font-medium'>Serial Number</span>
                    <span className='text-gray-500'>{issueDetails?.device?.serial_number || ""}</span>
                   </div>
                 </div>
               </div>

               <div className='flex bg-white flex-col rounded-md border-l-3 border-purple-500 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
                 <div className='bg-gradient-to-r flex justify-between p-4 from-purple-200 to-purple-50'>
                    <h1 className='text-lg font-semibold'>Service Details</h1>
                    <Wrench className='text-purple-500'></Wrench>
                 </div>
                 <div className='flex flex-col gap-4 p-4'>
                   <div className='flex items-center gap-2'>
                     <img src={ONSITE} className='w-10 h-10 '></img>
                     <div className='flex flex-col'>
                       <h1 className='font-medium'>{issueDetails?.service?.service_name || ""}</h1>
                       <span className='text-gray-400'>Rs. {issueDetails?.service?.price || 0}</span>
                     </div>
                   </div>
                   <div className='flex py-2 border-b border-neutral-200 justify-between'>
                     <div className='flex items-center gap-2'>
                        <span className='w-6 h-6 rounded-full flex justify-center items-center bg-orange-100'><Calendar className='w-4 text-orange-400 h-4'></Calendar></span>
                        <span>{formatDate(issueDetails?.date)}</span>
                     </div>
                     <div className='flex items-center gap-2'>
                        <span className='w-6 h-6 rounded-full flex justify-center items-center bg-green-100'><Clock className='w-4 text-green-400 h-4'></Clock></span>
                        <span>{issueDetails?.time?.time}</span>
                     </div>
                   </div>
                   {
                    issueDetails?.address && 
                    <div className='flex items-center gap-2'>
                      <span className='w-6 h-6 rounded-full flex justify-center items-center bg-pink-100'><MapPin className='w-4 text-pink-400 h-4'></MapPin></span>
                      <div className='flex flex-col'>
                        <span>{issueDetails?.address?.name} ({issueDetails?.address?.address_type})</span>
                        <span className='text-sm text-gray-500'>{issueDetails?.address?.house_no}, {issueDetails?.address?.nearby_landmark}, {issueDetails?.address?.pincode}</span>
                      </div>
                   </div>
                   }
                 </div>
               </div>

               {
                issueDetails?.images?.length > 0 && 
                <div className='flex bg-white flex-col rounded-md border-l-3 border-green-500 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
                  <div className='bg-gradient-to-r flex justify-between p-4 from-green-200 to-green-50'>
                   <h1 className='text-lg font-semibold'>Device Images</h1>
                   <Image className='text-green-500'></Image>
                  </div>
                  <div className='grid grid-cols-3 p-4 gap-2'>
                    {
                      issueDetails.images.map((item)=>(
                        <img alt={item.fileName} src={`${import.meta.env.VITE_APP_API_IMAGE_URL}/${item.filepath}`}></img>
                      ))
                    }
                  </div>
                </div>
               }
            </div>

            {/* Right Sections */}
            <div className='md:w-[40%] w-full flex flex-col gap-4'>
               <div className='flex bg-white flex-col rounded-md border-t-3 border-orange-500 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
                 <div className='bg-gradient-to-r flex justify-between p-4 from-orange-200 to-orange-50'>
                    <h1 className='text-lg font-semibold'>Customer</h1>
                    <User className='text-orange-500'></User>
                 </div>
                 <div className='p-4 border-b border-neutral-200 flex flex-col'>
                   <div className='w-full pb-2 flex items-center gap-2 border-b border-neutral-300'>
                     <img src={issueDetails?.added_by?.profilePic?.filePath ? `${import.meta.env.VITE_APP_API_IMAGE_URL}/${issueDetails?.added_by?.profilePic?.filePath}` : USER} className='w-8 h-8'></img>
                     <div className='flex flex-col gap-1'>
                       <span>{issueDetails?.added_by?.name || ""}</span>
                       <div className='flex items-center gap-1'>
                         <span className='text-sm text-gray-500'>{issueDetails?.added_by?.mobileno || ""}</span>
                       </div>
                     </div> 
                   </div>
                   <div className='py-2'>
                     <span className='text-sm text-gray-500'>Customer Since {formatDate(issueDetails?.added_by?.createdAt)}</span>
                   </div>
                 </div>
               </div>

               {
                issueDetails?.assignedEmployee &&
                <div className='flex bg-white flex-col rounded-md border-t-3 border-sky-500 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
                <div className='bg-gradient-to-r flex justify-between p-4 from-sky-200 to-sky-50'>
                   <h1 className='text-lg font-semibold'>Assigned Employee</h1>
                   <UserCog className='text-sky-500'></UserCog>
                </div>
                <div className='p-4 flex gap-2 items-center'>
                   <img src={issueDetails?.assignedEmployee?.profilePic?.filePath ? `${import.meta.env.VITE_APP_API_IMAGE_URL}/${issueDetails?.assignedEmployee?.profilePic?.filePath}` : EMPLOYEE} className='w-8 h-8'></img>
                   <div className='flex flex-col'>
                     <span>{issueDetails.assignedEmployee.firstName} {issueDetails.assignedEmployee.lastName}</span>
                     <span className='text-sm text-gray-500'>{issueDetails.assignedEmployee.email}</span>
                     <span className='text-sm text-gray-500'>{issueDetails.assignedEmployee.mobileno}</span>
                   </div>
                </div>
                </div>
               }

               { (issueDetails.status !=="Resolved" && issueDetails.status !=="Ongoing" && issueDetails.status !== "Canceled") &&
               <div className='flex bg-white flex-col rounded-md border-t-3 border-violet-500 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
                 <div className='bg-gradient-to-r flex justify-between p-4 from-violet-200 to-violet-50'>
                    <h1 className='text-lg font-semibold'>Action</h1>
                    <Ellipsis className='text-violet-500'></Ellipsis>
                 </div>
                 <div className='p-4 flex flex-col gap-2'>
                   {
                    issueDetails?.assignedEmployee ? 
                    <button disabled={removeLoader} onClick={handleRemoveEmployee} className='bg-red-500 flex justify-center items-center disabled:cursor-not-allowed disabled:bg-gray-400 p-1.5 cursor-pointer rounded-md text-white'>
                      {
                        removeLoader ? 
                        <LoaderCircle className='animate-spin'></LoaderCircle> :
                        <span>Remove Employee</span>

                      }
                    </button> :
                    <button onClick={()=>setOpenPreviewBox(true)} className='bg-green-500 p-1.5 cursor-pointer rounded-md text-white'>
                      Assign Employee
                    </button>
                   }
                  
                   <button onClick={handleCancelIssue} className='bg-red-500 p-1.5 cursor-pointer rounded-md text-white'>
                    Cancel Issue
                   </button>
                 </div>
               </div>
                }
            </div>
        </div>
    </div>
  )
}

export default PreviewBooking