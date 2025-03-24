import React, { useState } from 'react'  
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

//Importing icons
import { LoaderCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api';


function UserForm({setIsOpenUserForm,fetchData,user}) {
  const [formData,setFormData] = useState({
    name:user?user.name:'',
    mobileno:user?user.mobileno:'',
  })
  const [loading,setLoading] = useState(false)
  const [errors,setErrors] = useState({})

  const validateData = () =>{
     let newErrors = {}

     if(!formData.name) newErrors.name="Name is required."
     if(!formData.mobileno) newErrors.mobileno="Mobile No is required."

     setErrors(newErrors)

     return Object.keys(newErrors).length===0
     
  }
  
  const handleChange = (e) =>{
     const {name, value} = e.target
      
     setFormData((prevData)=>({...prevData,[name]:value}))

     setErrors((prevErrors)=>{
      const updatedErrors = { ...prevErrors };

      if (!value) {
        updatedErrors[name] = `Please enter ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
      } else {
        delete updatedErrors[name]; // Remove error if field is valid
      }
  
      return updatedErrors;
     })
  }

  const handleSubmitdata = async () =>{
  if(validateData()){
    setLoading(true)
    try{
       const response = await api.post('/user',{name:formData.name,mobileno:`+${formData.mobileno}`})
       await fetchData()
       setFormData(
        {name:'',
       mobileno:''})
       setIsOpenUserForm(false)
       toast.success("Successfully new user created.")
    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }finally{
      setLoading(false)
    }
  }
  }

  const handleEditUser = async () =>{
    if(validateData()){
      console.log(formData)
      setLoading(true)
      try{
        const response = await api.put(`/user/${user._id}`,formData)
        await fetchData()
        setFormData({
          name:'',
          mobileno:''
        })
        setIsOpenUserForm(false)
        toast.success('Successfully user edited.')
      }catch(err){
        toast.error(err?.response?.data?.message || "Something went wrong.")
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
  }
  

  return (
     <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50'>
        <div className='rounded-md bg-white flex flex-col gap-2.5 p-4 w-96'>
           <div className='flex items-center justify-between'>
             <h1 className='text-lg font-semibold'>{user?"Edit User Info":"Create New User"}</h1>
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
           </div>
           <button onClick={user?handleEditUser:handleSubmitdata} className='text-white mt-2 flex justify-center items-center cursor-pointer font-semibold p-1.5 rounded-md bg-button'>
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

export default UserForm