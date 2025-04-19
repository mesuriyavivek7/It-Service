import { X } from 'lucide-react'
import React, { useState } from 'react'

function ProfileEdit({user}) {
  const [formData,setFormData] = useState({
    name:user.name || "",
    email:user.email || "",
    mobileno:user.mobileno || ""
  })

  const [errors,setErrors] = useState({})
  const [loading,setLoading] = useState(false)

  const validateData = () =>{

  }

  const handleChange = (e) =>{
    const {name, value} = e.target
  }

  const handleSave = () =>{

  }

  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50'>
        <div className='bg-white w-96 rounded-md  flex flex-col'>
           <div className='p-4 flex justify-between items-center border-b border-neutral-200'>
             <h1 className='font-medium'>Edit Information</h1>
             <X className='text-red-500 cursor-pointer hover:text-red-600'></X>
           </div>
           <div className='p-4 flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                 <label htmlFor='name'>Name <span className='text-sm text-red-500'>*</span></label>
                 <input type='text' className='outline-none border rounded-md border-neutral-200 p-2' value={formData.name} ></input>
              </div>
              <div className='flex flex-col gap-1'>
                 <label htmlFor='mobileno'>Mobile No <span className='text-sm text-red-500'>*</span></label>
                 <input type='text' className='outline-none border rounded-md border-neutral-200 p-2' value={formData.mobileno} ></input>
              </div>
              <div className='flex flex-col gap-1'>
                 <label htmlFor='email'>Email <span className='text-sm text-red-500'>*</span></label>
                 <input type='text' className='outline-none border rounded-md border-neutral-200 p-2' value={formData.email} ></input>
              </div>
           </div>
        </div>
    </div>
  )
}

export default ProfileEdit