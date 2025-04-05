import React, { useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api'

//Importing icons
import { Search } from 'lucide-react'
import { RefreshCcw } from 'lucide-react'


function Service() {

  const [service,setService] = useState([])
  const [searchQuery,setSearchQuery] = useState('')
  const [loading,setLoading] = useState(false)
  
  const fetchData = async () =>{
     try{
        const response = await api.get('service')
        setService(response.data.data)
     }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
     }
  }


  return (
    <div className='w-full flex flex-col gap-4 h-full'>
       <div className='bg-white items-center flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>

          <h1 className='text-black text-lg font-medium'>Booking Services</h1>

          <div className='flex items-center gap-2'>
            <div className='flex border border-grayborder gap-2 rounded-md py-1.5 px-2 items-center'>
                <Search className='w-5 h-5 text-navtext'></Search>
                <input onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} className='outline-none placeholder:text-navtext placeholder:text-sm' placeholder='Search Bookings...'></input>
            </div>
            <div className='py-2 px-2 border-grayborder border rounded-md'>
                <RefreshCcw className='w-5 h-5 cursor-pointer'></RefreshCcw>
            </div>
         </div>

       </div>
    </div>
  )
}

export default Service