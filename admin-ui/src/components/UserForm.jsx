import React, { useState } from 'react'  
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

//Importing icons
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api';


function UserForm({setIsOpenUserForm}) {
  const [formData,setFormData] = useState({
    name:'',
    mobileno:'',
  })
  const [loading,setLoading] = useState(false)
  const [errors,setErrors] = useState({})

  const validateData = () =>{
     let newErrors = {}

     if(!formData.name) newErrors.name="Name is required."
     else if(!formData.mobileno) newErrors.mobileno="Mobile No is required."

     setErrors(newErrors)

     return Object.keys(newErrors).length===0
     
  }
  
  const handleChange = (e) =>{
     const {name, value} = e.target
      
     setFormData((prevData)=>({...prevData,[name]:value}))

     setErrors(()=>{
       let Obj = {}

       if(name==="name" && !value){
           Obj.name = 'Please enter user name.'
       }

       if(name==="mobileno" && !value){
          Obj.mobileno = 'Please enter mobileno.'
       }

       return Obj
     })
  }

  const handleSubmitdata = async () =>{
    setLoading(true)
    try{
       const response = await api.post('/user',formData)
    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }finally{
      setLoading(false)
    }
  }
  

  return (
     <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50'>
        <div className='rounded-md bg-white flex flex-col gap-2.5 p-4 w-96'>
           <div className='flex items-center justify-between'>
             <h1 className='text-lg font-semibold'>Create New User</h1>
             <X onClick={()=>setIsOpenUserForm(false)} className='text-red-500 cursor-pointer w-5 h-5'></X>
           </div>
           <div className='flex flex-col gap-2.5'>
            <div className='flex flex-col gap-1.5'>
              <label htmlFor='name'>Name <span className='text-sm text-red-500'>*</span></label>
              <div className='flex flex-col gap-1'>
                <input name='name' value={formData.value} onChange={handleChange} id='name' type='text' placeholder='Enter Name' className='p-2 outline-none border border-bordercolor rounded-md'></input>
                {errors.name && <span className='text-sm text-red-500'>{errors.name}</span>}
              </div>
            </div>
            <div className='flex flex-col gap-1.5'>
              <label>Mobile No <span className='text-sm text-red-500'>*</span></label>
              <div className='flex flex-col gap-1'>
              <PhoneInput
                 country={'in'}
                 value={formData.mobileno}
                 onChange={phone => handleChange({target:{name:'mobileno',value:phone}})}
                 placeholder='Enter Mobile no'
                 containerStyle={{
                  width: "100%", // Adjust width as needed
                  border:'1px solid #383f5a',
                  borderRadius: '6px'
                 }}
                 inputStyle={{
                  width: "90%", // Full width
                  marginLeft:'10%',
                  padding: "8px", // Add padding
                  borderRadius: "6px", // Rounded corners
                  fontSize: "16px", // Adjust font size
                }}
                buttonStyle={{
                  borderRadius: "6px 0 0 6px", // Match input border radius
                  background:'white',
                  borderRight:'1px solid #383f5a'
                }}
              />
              {errors.mobileno && <span className='text-sm text-red-500'>{errors.mobileno}</span>}
              </div>
            </div>
           </div>
           <button className='text-white mt-2 font-semibold p-1.5 rounded-md bg-button'>Submit</button>
        </div>
     </div>
  )
}

export default UserForm