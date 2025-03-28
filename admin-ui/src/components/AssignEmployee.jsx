import React from 'react'

//Importing icons
import { X } from 'lucide-react'

function AssignEmployee() {
  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50'>
        <div className='rounded-md bg-white flex flex-col gap-2.5 p-4'>
           <div className='flex items-center justify-between'>
            <h1 className='text-lg font-semibold'>Assign Employee</h1>
            <X onClick={()=>setIsOpenUserForm(false)} className='text-red-500 cursor-pointer w-5 h-5'></X>
          </div>
          <div className='flex flex-col gap-3'>
            
          </div>
       </div>
    </div>
  )
}

export default AssignEmployee