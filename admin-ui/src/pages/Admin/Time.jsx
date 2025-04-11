import React , {useEffect, useState} from 'react'
import { toast } from 'react-toastify'
import api from '../../api'

//Importing icons
import { LoaderCircle, Search } from 'lucide-react'
import { RefreshCcw } from 'lucide-react'
import { Plus } from 'lucide-react'
import { Pencil } from 'lucide-react';
import { Trash2 } from 'lucide-react';


import TimeForm from '../../components/TimeForm'
import DeleteModal from '../../components/DeleteModal'

function Time() {
    const [time,setTime] = useState([])
    const [loading,setLoading] = useState(false)
    const [searchQuery,setSearchQuery] = useState('')
    const [openModal,setOpenModal] = useState(false)
    const [selectedTime,setSelectedTime] = useState(null)
    const [openConfirm,setOpenConfirm] = useState(false)

    const fetchData = async () =>{
        setLoading(true)
        try{
           const response = await api.get('time')
           setTime(response.data.data)
        }catch(err){
           console.log(err)
           toast.error(err?.response?.data?.message || "Something went wrong.")
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
      fetchData()
    },[])

    const handleOpenModal = (data) =>{
       setSelectedTime(data)
       setOpenModal(true)
    }

    const handleCloseModal = () =>{
       setSelectedTime(null)
       setOpenModal(false)
       fetchData()
    }

    const handleOpenConfirmModal = (data) =>{
       setSelectedTime(data)
       setOpenConfirm(true)
    }

    const handleCloseConfirmModal = () => {
      setSelectedTime(null)
      setOpenConfirm(false)
      fetchData()
    }

    const handleRemoveTime = async () =>{
      setLoading(true)
      try{
        const response = await api.delete(`time/${selectedTime._id}`)
        handleCloseConfirmModal()
        toast.success("Time deleted successfully.")
      }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
      }finally{
        setLoading(false)
      }
    }

  return (
    <div className='w-full flex flex-col gap-4 h-full'>
      {
        openModal && 
        <TimeForm handleCloseModal={handleCloseModal} time={selectedTime}></TimeForm>
      }
      {
        openConfirm && 
        <DeleteModal handleCancel={handleCloseConfirmModal} handleDelete={handleRemoveTime} modalType={"Time"}></DeleteModal>
      }
     <div className='bg-white items-center flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>

        <button onClick={()=>handleOpenModal(null)} className='bg-button cursor-pointer rounded-md py-1.5 px-2 text-[14px] text-white font-medium flex gap-2 items-center'>
            <Plus className='w-4 h-4'></Plus>
            <span>Add Time</span>
        </button>

        <div className='flex items-center gap-2'>
           <div className='flex md:w-auto w-36 border border-grayborder gap-2 rounded-md py-1.5 px-2 items-center'>
           <Search className='w-5 h-5 text-navtext'></Search>
           <input onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} className='outline-none placeholder:text-navtext placeholder:text-sm' placeholder='Search Time...'></input>
           </div>
          <div onClick={fetchData} className='py-2 px-2 border-grayborder border rounded-md'>
            <RefreshCcw className='w-5 h-5 cursor-pointer'></RefreshCcw>
          </div>
        </div>
     </div>

      {
        loading ? 
        <div className='w-full h-full flex justify-center items-center'>
             <LoaderCircle className='text-themecolor animate-spin'></LoaderCircle>
        </div>:
        <div className='grid md:grid-cols-4 grid-cols-2 items-center gap-4'>
             {
                time.map((time,index)=>(
                <div key={index} className='border p-2 border-neutral-200 rounded-md bg-white flex justify-between'>
                   <h1>{time.time}</h1>
                   <div className='flex items-center gap-2'>
                     <button onClick={()=>handleOpenModal(time)} className='flex p-1 cursor-pointer justify-center items-center hover:bg-slate-200 transition-all duration-300 rounded-md'>
                      <Pencil className='w-4 h-4'></Pencil>
                     </button>
                     <button onClick={()=>handleOpenConfirmModal(time)} className='flex p-1 cursor-pointer justify-center items-center hover:bg-red-200 transition-all duration-300 rounded-md'>
                       <Trash2 className='w-4 h-4'></Trash2>
                      </button>
                   </div>
                 </div>
                ))
             }
        </div>
      }
     

    </div>
  )
}

export default Time