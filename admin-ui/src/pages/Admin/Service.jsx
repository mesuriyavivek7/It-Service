import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api'

//Importing icons
import { LoaderCircle, Search } from 'lucide-react'
import { RefreshCcw } from 'lucide-react'
import { FilePenLine } from 'lucide-react';
import { Plus } from 'lucide-react'
import { ChevronDown } from 'lucide-react';
import { ChevronUp } from 'lucide-react';


//Importing components
import ServiceForm from '../../components/ServiceForm'
import DeleteModal from '../../components/DeleteModal'


function Service() {

  const [service,setService] = useState([])
  const [filterService,setFilterService] = useState([])
  const [searchQuery,setSearchQuery] = useState('')
  const [loading,setLoading] = useState(false)
  const [selectedService,setSelectedService] = useState(null)
  const [openPopUp,setOpenPopUp] = useState(false)
  const [openActive,setOpenActive] = useState(null)
  const [openDeleteModal,setOpenDeleteModal] = useState(false)

  const formatDate =(date) => {
   if(!date) return ''

   let myd = new Date(date)
   const options = { month: 'short', day: '2-digit', year: 'numeric' };
   return myd.toLocaleDateString('en-US', options);
 }
 
  
  const fetchData = async () =>{
     setLoading(true)
     try{
        const response = await api.get('service')
        console.log(response.data.data)
        setService(response.data.data)
     }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
     } finally{
      setLoading(false)
     }
  }


  useEffect(()=>{
    fetchData()
  },[])

  const handlOpen = (item) =>{
    setSelectedService(item)
    setOpenPopUp(true)
  }

  const handleClose = () =>{
    setSelectedService(null)
    setOpenPopUp(false)
    fetchData()
  }

  const handleEnableService = async (id) =>{
    try{
      const response = await api.post(`/service/enable-service/${id}`)
      await fetchData()
      setOpenActive(false)
      toast.success("Service enable successfully.")
    }catch(err){
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }
  }

  const handleDisableService = async () =>{
   try{
     const response = await api.post(`/service/disable-service/${selectedService._id}`)
     handleCloseDeleteModal()
     toast.success("Service disabled successfully.")
   }catch(err){
    toast.error(err?.response?.data?.message || "Something went wrong.")
   }
  }

  const handleOpenDeleteModal = (item) =>{
    setOpenDeleteModal(true)
    setSelectedService(item)
  }

  const handleCloseDeleteModal = () =>{
    setOpenActive(false)
    setOpenDeleteModal(false)
    fetchData()
  }

  useEffect(()=>{
    if(searchQuery){
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = service.filter((user) =>
        Object.values(user).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseQuery)
        )
      );
      setFilterService(filtered);
    }else{
      setFilterService(service)
    }
  },[searchQuery,service])


  return (
    <div className='w-full flex flex-col gap-4 h-full'>
       {
         openPopUp && 
         <ServiceForm service={selectedService} handleClose={handleClose}></ServiceForm>
       }
       {
        openDeleteModal &&
        <DeleteModal handleCancel={handleCloseDeleteModal} handleDelete={handleDisableService} modalType={'service'} action={'disable'}></DeleteModal>
       }
       <div className='bg-white items-center flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>

          <button onClick={()=>setOpenPopUp(true)} className='bg-button cursor-pointer rounded-md py-1.5 px-2 text-[14px] text-white font-medium flex gap-2 items-center'>
            <Plus className='w-4 h-4'></Plus>
            <span>Add Service</span>
          </button>

          <div className='flex items-center gap-2'>
            <div className='flex md:w-auto w-36 border border-grayborder gap-2 rounded-md py-1.5 px-2 items-center'>
                <Search className='w-5 h-5 text-navtext'></Search>
                <input onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} className='outline-none placeholder:text-navtext placeholder:text-sm' placeholder='Search Services...'></input>
            </div>
            <div onClick={fetchData} className='py-2 px-2 border-grayborder border rounded-md'>
                <RefreshCcw className='w-5 h-5 cursor-pointer'></RefreshCcw>
            </div>
         </div>

       </div>

       <div className='flex w-full h-full justify-center items-center'>
          {
            loading ? 
            (
               <LoaderCircle className='animate-spin w-8 h-8 text-blue-500'></LoaderCircle>
            ) :
            (
               <div className='w-full h-full grid grid-cols-1 md:grid-cols-3 items-start gap-4'>
               {filterService.map((item,index)=>(
                
                  <div key={index} className='flex relative md:overflow-hidden rounded-md border border-neutral-200 shadow flex-col'>
                      <div className={`absolute text-sm rounded-md text-white top-2 right-2 ${item.status?"bg-green-400":"bg-red-500"}`}>
                        <div onClick={()=>setOpenActive((prev)=> !prev?item._id:null)} className='flex p-1.5  items-center gap-1'>
                         {item.status?"Active":"Inactive"} {openActive===item._id ? <ChevronUp className='w-4 h-4 cursor-pointer'></ChevronUp> : <ChevronDown className='w-4 h-4 cursor-pointer'></ChevronDown> } 
                        </div>
                        <div className={`w-full ${openActive===item._id?"h-8 p-1.5":"h-0"} transition-all duration-300 cursor-pointer ${item.status?"bg-red-500":"bg-green-500"} rounded-b-md`}>
                          {
                            item.status ? 
                            <span onClick={()=>handleOpenDeleteModal(item)}>Disable</span>
                            :<span onClick={()=>handleEnableService(item._id)}>Enable</span>
                          }
                        </div>
                      </div>

                      <img className='h-80' src={`${import.meta.env.VITE_APP_API_IMAGE_URL}/${item?.service_image?.filePath}`} alt='service image'>
                      </img>
                      <div className='p-4 bg-white border-t border-neutral-200 flex flex-col gap-2'>
                         <div className='flex justify-between items-center'>
                           <span>{item?.service_name || "No Name provided"}</span>
                           <span>₹{item?.price}</span>
                         </div>
                         <span className='text-textco text-sm'>Created On: {formatDate(item?.createdAt)} </span>
                      </div>
                      <div className='flex border-t p-2 border-neutral-200 bg-white justify-center items-center'>
                         <button onClick={()=>handlOpen(item)} className='flex cursor-pointer hover:bg-themecolor hover:text-white transition-colors duration-300 gap-2 p-1.5 border-bordercolor border rounded-md'>
                           <FilePenLine></FilePenLine>
                           Edit Service
                          </button>
                      </div>
                  </div>
               ))}
               </div>
            )
          }
       </div>

    </div>
  )
}

export default Service