import React, { useState } from 'react'

//Importing icons
import { Eye, EyeOff, LoaderCircle, X } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../api'

function ChangePassword({handleCloseChangePassPopUp}) {

  const [formData,setFormData] = useState({
    currentPassword:'',
    newPassword:'',
    confirmPassword:''
  })

  const [loading,setLoading] = useState(false)
  const [errors,setErrors] = useState({})

  const [showCurrentPass,setShowCurrentPass] = useState(false)
  const [showNewPass,setShowNewPass] = useState(false)
  const [showConfirmPass,setShowConfirmPass] = useState(false)

  const validateData = () => {
    let newErrors = {}

    if(!formData.currentPassword) newErrors.currentPassword = "Current password is required."
    if(!formData.newPassword) newErrors.newPassword = "New password is required."
    if(!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required."
    else if(formData.newPassword!==formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is not matched with new password.'

    setErrors(newErrors)

    return Object.keys(newErrors).length===0
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

  
    setFormData((prevData) => ({...prevData,[name]: value}));
  
    setErrors((prevErrors) => {
      let newErrors = { ...prevErrors };

      if (!value) {
        newErrors[name] = `${name} is required.`;
      } else if(name==="confirmPassword" && value && value!==formData.newPassword){
        newErrors[name] = 'Confirm password must be same with new password.'
      } else {
        delete newErrors[name];
      }

      return newErrors; 
    });

  };

  const handleSave = async () =>{
   if(validateData()){
    setLoading(true)
    try{
      const response = await api.post('auth/change-password',formData)
      handleCloseChangePassPopUp()
      toast.success('Password changed successfully.')
    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }finally{
      setLoading(false)
    }
   }
  }

  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50'>
      <div className='bg-white w-96 rounded-md flex flex-col'>
           <div className='p-4 flex justify-between items-center border-b border-neutral-200'>
             <h1 className='font-medium'>Change Password</h1>
             <X onClick={handleCloseChangePassPopUp} className='text-red-500 cursor-pointer hover:text-red-600'></X>
           </div>
           <div className='flex flex-col p-4 gap-4'>
             <div className='flex flex-col gap-1'>
               <label htmlFor='currentPassword'>Current Password <span className='text-sm text-red-500'>*</span></label>
               <div className='flex relative flex-col'>
                 <input onChange={handleChange} type={showCurrentPass?"text":"password"} id='currentPassword' name='currentPassword' value={formData.currentPassword} className='outline-none border rounded-md border-neutral-200 p-2' placeholder='Enter Current Password'></input>
                 <span onClick={()=>setShowCurrentPass((prevData)=>!prevData)} className='absolute text-gray-600 top-3 right-2'>{!showCurrentPass?<Eye className='w-5 h-5'></Eye>:<EyeOff className='w-5 h-5'></EyeOff>}</span>
                 {errors.currentPassword && <span className='text-sm text-red-500'>{errors.currentPassword}</span>}
               </div>
             </div>
             <div className='flex flex-col gap-1'>
               <label htmlFor='newPassword'>New Password <span className='text-sm text-red-500'>*</span></label>
               <div className='flex relative flex-col'>
                 <input onChange={handleChange} type={showNewPass?"text":"password"} id='newPassword' name='newPassword' value={formData.newPassword} className='outline-none border rounded-md border-neutral-200 p-2' placeholder='Enter New Password'></input>
                 <span onClick={()=>setShowNewPass((prevData)=>!prevData)} className='absolute text-gray-600 top-3 right-2'>{!showNewPass?<Eye className='w-5 h-5'></Eye>:<EyeOff className='w-5 h-5'></EyeOff>}</span>
                 {errors.newPassword && <span className='text-sm text-red-500'>{errors.newPassword}</span>}
               </div>
             </div>
             <div className='flex flex-col gap-1'>
               <label htmlFor='confirmPassword'>Confirm Password <span className='text-sm text-red-500'>*</span></label>
               <div className='flex relative flex-col'>
                 <input onChange={handleChange} type={showConfirmPass?"text":"password"} id='confirmPassword' name='confirmPassword' value={formData.confirmPassword} className='outline-none border rounded-md border-neutral-200 p-2' placeholder='Enter Confirm Password'></input>
                 <span onClick={()=>setShowConfirmPass((prevData)=>!prevData)} className='absolute text-gray-600 top-3 right-2'>{!showConfirmPass?<Eye className='w-5 h-5'></Eye>:<EyeOff className='w-5 h-5'></EyeOff>}</span>
                 {errors.confirmPassword && <span className='text-sm text-red-500'>{errors.confirmPassword}</span>}
               </div>
             </div>
           </div>
           <div className='flex p-4 justify-center items-center'>
                 <button onClick={handleSave} className='bg-button flex justify-center items-center cursor-pointer px-2 py-1 text-white rounded-md w-32'>{
                    loading ? 
                    <LoaderCircle className='animate-spin'></LoaderCircle>
                    :<span>Save</span>
                 }</button>
           </div>
      </div>
    </div>
  )
}

export default ChangePassword