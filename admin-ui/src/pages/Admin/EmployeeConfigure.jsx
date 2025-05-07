import React, { useEffect, useState } from 'react'

import EmpConfigureForm from '../../components/EmpConfigureForm'
//Importing icons
import { LoaderCircle, Plus } from 'lucide-react'
import { Trash } from 'lucide-react';


import { toast } from 'react-toastify'
import api from '../../api'

function EmployeeConfigure() {

  const [departments,setDepartments] = useState([])
  const [designation,setDesignation] = useState([])
  const [departmentLoader,setDepartmentLoader] = useState(false)
  const [designationLoader,setDesignationLoader] = useState(false)
  const [isOpenConfigureForm,setIsOpenConfigureForm] = useState({status:false, type:''})


  const fetchDesignations = async () =>{
    try{
        setDesignationLoader(true)
        const response = await api.get('/empconfigure/get-designations')
        setDesignation(response.data.data)
    }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
    }finally{
        setDesignationLoader(false)
    }
 }

 const fetchDepartments = async () =>{
    try{
        setDepartmentLoader(true)
        const response = await api.get('/empconfigure/get-departments')
        setDepartments(response.data.data)
    }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
    }finally{
        setDepartmentLoader(false)
    }
 }

  useEffect(()=>{
    fetchDesignations()
    fetchDepartments()
  },[])

  const handleOpenConfigureForm = (type) =>{
     setIsOpenConfigureForm({status:true,type})
  }

  const handleCloseConfigureForm = (type) =>{
      if(type==="department"){
        fetchDepartments()
      }else if(type==="designation"){
        fetchDesignations()
      }
      setIsOpenConfigureForm({status:false,type:''})
  }

  console.log(isOpenConfigureForm)

  return (
     <div className='flex flex-col w-full gap-4 h-full'>

      {
        isOpenConfigureForm.status && 
        <EmpConfigureForm type={isOpenConfigureForm.type} handleCloseConfigureForm={handleCloseConfigureForm}></EmpConfigureForm>
      }

      <div className='flex flex-col w-full gap-4'>

       <div className='bg-white flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold'>Employee Department</h1>
        </div>
        <button onClick={()=>handleOpenConfigureForm('department')} className='bg-button cursor-pointer rounded-md py-1.5 px-2 text-[14px] text-white font-medium flex gap-2 items-center'>
             <Plus className='w-4 h-4'></Plus>
             <span>Add Department</span>
         </button>
       </div>

       <div className='w-full rounded-md p-4 min-h-96 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
           {
              departmentLoader ? 
              <div className='w-full flex justify-center items-center h-full'>
                 <LoaderCircle className='animate-spin text-blue-500'></LoaderCircle>
              </div>
              : departments.length === 0 ?
               <div className='w-full flex justify-center items-center h-full'>
                  <span className='text-gray-600 text-sm'>No any departments found.</span>
               </div>
              : <div className='grid grid-cols-4 items-start gap-4'>
                 {
                  departments.map((item,index) =>(
                    <div key={index} className='flex rounded-md bg-white border border-neutral-200 items-center justify-between p-2'>
                       <span>{item.department_name}</span>
                       <Trash className='text-red-500 w-4 h-4 cursor-pointer'></Trash>
                    </div>
                  )) 
                 }
              </div>
           }
       </div>

      </div>

      <div className='flex flex-col w-full gap-4'>

       <div className='bg-white flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold'>Employee Designation</h1>
        </div>
        <button onClick={()=>handleOpenConfigureForm('designation')} className='bg-button cursor-pointer rounded-md py-1.5 px-2 text-[14px] text-white font-medium flex gap-2 items-center'>
             <Plus className='w-4 h-4'></Plus>
             <span>Add Designation</span>
         </button>
       </div>

       <div className='w-full rounded-md p-4 min-h-96 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
           {
              designationLoader ? 
              <div className='w-full flex justify-center items-center h-full'>
                 <LoaderCircle className='animate-spin text-blue-500'></LoaderCircle>
              </div>
              : designation.length === 0 ?
               <div className='w-full flex justify-center items-center h-full'>
                  <span className='text-gray-600 text-sm'>No any designation found.</span>
               </div>
              : <div className='grid grid-cols-4 items-start gap-4'>
                {
                  designation.map((item,index) =>(
                    <div key={index} className='flex rounded-md bg-white border border-neutral-200 items-center justify-between p-2'>
                       <span>{item.designation_name}</span>
                       <Trash className='text-red-500 w-4 h-4 cursor-pointer'></Trash>
                    </div>
                  )) 
                 }
              </div>
           }
       </div>

      </div>
     
     </div>
  )
}

export default EmployeeConfigure