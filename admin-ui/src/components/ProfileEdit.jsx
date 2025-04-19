import { LoaderCircle, X } from 'lucide-react'
import React, { useState } from 'react'
import api from '../api'
import { toast } from 'react-toastify'

function ProfileEdit({user,handleCloseEditPopUp}) {
  const [formData,setFormData] = useState({
    name:user.name || "",
    email:user.email || "",
    mobileno:user.mobileno || ""
  })

  const [errors,setErrors] = useState({})
  const [loading,setLoading] = useState(false)

  const validateData = () =>{
    let newErrors = {}
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    if(!formData.name) newErrors.name="Name is required."

    if(!formData.email) newErrors.email ='Email address is required.'
    else if(!emailRegex.test(formData.email)) newErrors.email = "Invalid email address."
    
    if(!formData.mobileno) newErrors.mobileno = 'Mobile no is required.'
    else if(!mobileRegex.test(formData.mobileno)) newErrors.mobileno = 'Invalid mobile no.'

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) =>{
    const {name, value} = e.target
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

    setFormData((prevData)=>({...prevData,[name]:value}))

    setErrors((prevError)=>{
        let newErrors = {...prevError}

        if(name==="name" && !value) newErrors.name="Name is required."
        else delete newErrors.name

        if(name==="email" && !value) newErrors.email="Email address is required."
        else if(name==="email" && !emailRegex.test(value)) newErrors.email="Email address is invalid."
        else delete newErrors.email

        if(name==="mobileno" && !value) newErrors.mobileno = "Mobile no is required."
        else if(name==='mobileno' && !mobileRegex.test(value)) newErrors.mobileno = "Mobileno is invalid."
        else delete newErrors.mobileno

        return newErrors
    })

  }

  const handleSave = async () =>{
    if(validateData()){
      try{
        setLoading(true)
        const response = await api.put('admin',formData)
        handleCloseEditPopUp()
        toast.success("Information updated successfully.")
      }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
      }finally{
        setLoading(false)
      }
    }
  }

  console.log('errors--->',errors)

  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50'>
        <div className='bg-white w-96 rounded-md  flex flex-col'>
           <div className='p-4 flex justify-between items-center border-b border-neutral-200'>
             <h1 className='font-medium'>Edit Information</h1>
             <X onClick={handleCloseEditPopUp} className='text-red-500 cursor-pointer hover:text-red-600'></X>
           </div>
           <div className='p-4 flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                 <label htmlFor='name'>Name <span className='text-sm text-red-500'>*</span></label>
                 <div className='flex flex-col'>
                  <input name='name' onChange={handleChange} type='text' className='outline-none border rounded-md border-neutral-200 p-2' value={formData.name} ></input>
                  {errors.name && <span className='text-sm text-red-500'>{errors.name}</span>}
                 </div>
              </div>
              <div className='flex flex-col gap-1'>
                 <label htmlFor='mobileno'>Mobile No <span className='text-sm text-red-500'>*</span></label>
                 <div className='flex flex-col'>
                   <input name='mobileno' onChange={handleChange} type='text' className='outline-none border rounded-md border-neutral-200 p-2' value={formData.mobileno} ></input>
                   {errors.mobileno &&  <span className='text-sm text-red-500'>{errors.mobileno}</span>}
                 </div>
              </div>
              <div className='flex flex-col gap-1'>
                 <label htmlFor='email'>Email <span className='text-sm text-red-500'>*</span></label>
                 <div className='flex flex-col'>
                   <input name='email' onChange={handleChange} type='text' className='outline-none border rounded-md border-neutral-200 p-2' value={formData.email} ></input>
                   {errors.email &&  <span className='text-sm text-red-500'>{errors.email}</span>}
                 </div>
              </div>
              <div className='flex justify-center items-center'>
                 <button onClick={handleSave} className='bg-button flex justify-center items-center cursor-pointer px-2 py-1 text-white rounded-md w-32'>{
                    loading ? 
                    <LoaderCircle className='animate-spin'></LoaderCircle>
                    :<span>Save</span>
                 }</button>
              </div>
           </div>
        </div>
    </div>
  )
}

export default ProfileEdit