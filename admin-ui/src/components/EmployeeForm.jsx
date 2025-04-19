import React, { useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

//Importing icons
import { LoaderCircle, X } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { Eye } from 'lucide-react';

import { toast } from 'react-toastify';
import api from '../api';


function EmployeeForm({setIsOpenUserForm, fetchData, user}) {

  const [formData,setFormData] = useState({
    name:user?user.name:'',
    mobileno:user?user.mobileno:'',
    email:user?user.email:'',
    password:''
  })  
  const [loading,setLoading] = useState(false)
  const [errors,setErrors] = useState({})
  const [showPassword,setShowPassword] = useState(false)

  const validateData = () =>{
    let newErrors = {}
    let emailRegax = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if(!formData.name) newErrors.name="Name is required."
    if(!formData.mobileno) newErrors.mobileno="Mobile no is required."
    if(!formData.email) newErrors.email = 'Email address is required.'
    if(!emailRegax.test(formData.email)) newErrors.email="Email address is invalid."
    if(!user && !formData.password) newErrors.password = "Password is required."

    setErrors(newErrors)

    return Object.keys(newErrors).length===0

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  
    setErrors((prevErrors) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const newErrors = { ...prevErrors };
  
      // Name validation
      if (name === "name" && !value.trim()) {
        newErrors.name = "Please enter employee name.";
      } else {
        delete newErrors.name;
      }
  
      // Mobile number validation
      if (name === "mobileno" && !value.trim()) {
        newErrors.mobileno = "Please enter mobile number.";
      } else {
        delete newErrors.mobileno;
      }
  
      // Email validation
      if (name === "email") {
        if (!value.trim()) {
          newErrors.email = "Please enter email address.";
        } else if (!emailRegex.test(value.trim())) {
          newErrors.email = "Email address is invalid.";
        } else {
          delete newErrors.email;
        }
      }
  
      // Password validation (only if user is not defined)
      if (!user && name === "password") {
        if (!value.trim()) {
          newErrors.password = "Please enter password.";
        } else {
          delete newErrors.password;
        }
      }
  
      return newErrors;
    });
  };
  
 console.log(errors)
  
  const handleSubmitdata = async () =>{

    if(validateData()){
      setLoading(true)
      try{
         const response = await api.post('/employee',{name:formData.name,mobileno:`+${formData.mobileno}`,email:formData.email,password:formData.password})
         await fetchData()
         setFormData(
          {name:'',
          mobileno:'',
          email:'',
          password:''
          })
         setIsOpenUserForm(false)
         toast.success("Successfully new employee created.")
      }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
      }finally{
        setLoading(false)
      }
    }
}

const handleEditEmployee = async () =>{
   if(validateData()){
    setLoading(true)
    try{
      const response = await api.put(`/employee/${user._id}`,formData)
      await fetchData()
      setFormData({
        name:'',
        mobileno:'',
        email:''
      })
      setIsOpenUserForm(false)
      toast.success("Successfully employee details updated.")
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
    <div className='rounded-md bg-white flex flex-col gap-2.5 p-4 w-96'>
       <div className='flex items-center justify-between'>
         <h1 className='text-lg font-semibold'>{user?"Edit Employee Info":"Create New Employee"}</h1>
         <X onClick={()=>setIsOpenUserForm(false)} className='text-red-500 cursor-pointer w-5 h-5'></X>
       </div>
       <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='name'>Name <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='name' value={formData.name} onChange={handleChange} id='name' type='text' placeholder='Enter Name' className='p-2 outline-none border border-bordercolor rounded-md'></input>
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
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='email'>Email <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='email' value={formData.email} onChange={handleChange} id='email' type='text' placeholder='Enter Email' className='p-2 outline-none border border-bordercolor rounded-md'></input>
            {errors.email && <span className='text-sm text-red-500'>{errors.email}</span>}
          </div>
        </div>
       {
        !user && 
        <div className='flex flex-col gap-1.5'>
         <label htmlFor='password'>Password <span className='text-sm text-red-500'>*</span></label>
         <div className='relative flex flex-col gap-1'>
            <input name='password'  value={formData.password} onChange={handleChange} id='password' type={showPassword?"text":"password"} placeholder='Enter Password' className='p-2 outline-none border border-bordercolor rounded-md'></input>
            <span onClick={()=>setShowPassword((prevData)=>!prevData)} className='absolute right-2 top-3 cursor-pointer'>{!showPassword?<Eye className='w-5 h-5'></Eye>:<EyeOff className='w-5 h-5'></EyeOff>}</span>
            {errors.password && <span className='text-sm text-red-500'>{errors.password}</span>}
         </div>
        </div>
       }
       </div>
       <button onClick={user?handleEditEmployee:handleSubmitdata} className='text-white mt-2 flex justify-center items-center cursor-pointer font-semibold p-1.5 rounded-md bg-button'>
          {
            loading ? 
            <div className='flex items-center gap-2'>
               <LoaderCircle className='animate-spin'></LoaderCircle>
               ...Loading
            </div>
            :<span>{user?"Save Changes":"Submit"}</span>
          }
       </button>
    </div>
 </div>
  )
}

export default EmployeeForm