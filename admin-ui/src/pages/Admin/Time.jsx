import React , {useEffect, useState} from 'react'
import { toast } from 'react-toastify'
import api from '../../api'

//Importing icons
import { LoaderCircle, Search } from 'lucide-react'
import { RefreshCcw } from 'lucide-react'
import { Plus } from 'lucide-react'
import { Pencil } from 'lucide-react';

import TimeForm from '../../components/TimeForm'

function Time() {
    const [time,setTime] = useState([])
    const [loading,setLoading] = useState(false)
    const [searchQuery,setSearchQuery] = useState('')

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

  return (
    <div className='w-full flex flex-col gap-4 h-full'>
      {
        <TimeForm></TimeForm>
      }
     <div className='bg-white items-center flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>

        <button onClick={()=>setIsOpenUserForm(true)} className='bg-button cursor-pointer rounded-md py-1.5 px-2 text-[14px] text-white font-medium flex gap-2 items-center'>
            <Plus className='w-4 h-4'></Plus>
            <span>Add Time</span>
        </button>

        <div className='flex items-center gap-2'>
           <div className='flex border border-grayborder gap-2 rounded-md py-1.5 px-2 items-center'>
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
        <div className='grid grid-cols-4 items-center gap-4'>
             {
                time.map((time,index)=>(
                <div key={index} className='border p-2 border-neutral-200 rounded-md bg-white flex justify-between'>
                   <h1>{time.time}</h1>
                  <div className='flex p-1 cursor-pointer justify-center items-center hover:bg-gray-200 transition-all duration-300 rounded-md'>
                    <Pencil className='w-4 h-4'></Pencil>
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