import React, { useState } from 'react'

//Import icons
import { LoaderCircle, X } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../api'

function TwilioForm({setOpenEdit,data,fetchData}) {

  const [formData,setFormData] = useState({
    accountsid:data?.accountsid || '',
    authtoken:data?.authtoken || '',
    mobileno:data?.mobileno || ''
  })  

  const [loading,setLoading] = useState(false)
  const [errors,setErrors] = useState({})


  const validateDate = () =>{
     let newErrors = {}
 
     let regex = /^\+[1-9]{1,3}[0-9]{6,14}$/;

     if(!formData.accountsid) newErrors.accountsid = 'Account sid is required.'
     if(!formData.authtoken) newErrors.authtoken = 'Auth Token is required.'
     if(!formData.mobileno) newErrors.mobileno = 'Mobile number is required.'
     else if(!regex.test(formData.mobileno)) newErrors.mobileno = 'Mobile number must be with country code (+91...)'

     setErrors(newErrors)

     return Object.keys(newErrors).length===0
  }

  const handleChangeData = (e) =>{
     const {name,value} = e.target

     let regex = /^\+[1-9]{1,3}[0-9]{6,14}$/;

     setFormData((prev)=>({...prev,[name]:value}))

     setErrors((prevErrors)=>{
        let newErrors = {...prevErrors}

        if(name==="accountsid" && !value){
            newErrors.accountsid = 'Account sid is required.'
        }else{
            delete newErrors.accountsid
        }

        if(name==="authtoken" && !value){
            newErrors.authtoken = 'Auth Token is required.'
        }else{
            delete newErrors.authtoken
        }

        if(name==="mobileno" && !value){
            newErrors.mobileno = 'Mobileno is required.'
        }else if(name==="mobileno" && !regex.test(value)){
            newErrors.mobileno = 'Mobile number must be with country code (+91..)'
        }else{
            delete newErrors.mobileno
        }

        return newErrors

     })
  }


  const handleUpdateData = async () =>{
     if(validateDate()){
        setLoading(true)
        try{
           const response = await api.put(`twilio/${data?._id}`,formData)
           await fetchData()
           setOpenEdit(false)
           toast.success("Your details saved successfully.")
        }catch(err){
           console.log(err)
           toast.error(err?.response?.data?.message || "Something went wrong.")
        }finally{
           setLoading(false)
        }
     }
  }



  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50">
     <div className="w-96 bg-white flex flex-col gap-2 rounded-md shadow">
       <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
          <h1 className='font-medium'>Edit Twilio Configuration</h1>
          <button onClick={()=>setOpenEdit(false)}><X className="text-neutral-600 hover:text-red-500 w-5.5 h-5.5 transition-all duration-300"></X></button>
       </div>
       <div className="flex flex-col gap-2 px-4 py-2">
          <div className="flex flex-col gap-1">
            <label htmlFor='accountsid' className="text-sm">Account Sid <span className='text-sm text-red-500'>*</span></label>
            <div className='flex flex-col'>
              <input onChange={handleChangeData} value={formData.accountsid} name='accountsid' id='accountsid'  type='text' className='p-2 outline-none border border-bordercolor rounded-md' placeholder='Enter account sid'></input>
               {errors.accountsid && <span className='text-sm text-red-500'>{errors.accountsid}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor='authtoken' className="text-sm">Auth Token <span className='text-sm text-red-500'>*</span></label>
            <div className='flex flex-col'>
              <input onChange={handleChangeData} value={formData.authtoken} name='authtoken' id='authtoken' type='text' className='p-2 outline-none border border-bordercolor rounded-md' placeholder='Enter auth token'></input>
              {errors.authtoken && <span className='text-sm text-red-500'>{errors.authtoken}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor='mobileno' className="text-sm">Mobileno <span className='text-sm text-red-500'>*</span></label>
            <div className='flex flex-col'>
              <input onChange={handleChangeData} name='mobileno' value={formData.mobileno} id='mobileno' type='text' className='p-2 outline-none border border-bordercolor rounded-md' placeholder='Enter Mobileno'></input>
              {errors.mobileno && <span className='text-sm text-red-500'>{errors.mobileno}</span>}
            </div> 
          </div>
       </div>
       <div className='p-2 mb-2 flex justify-center items-center'>
         <button onClick={handleUpdateData} disabled={loading} className='bg-button flex justify-center items-center cursor-pointer rounded-md w-52 p-1.5 text-white font-medium'>
            {
                loading ? 
                <LoaderCircle className='animate-spin'></LoaderCircle>
                :<span>Save</span>
            }
         </button>
       </div>
     </div>
    </div>
  )
}

export default TwilioForm