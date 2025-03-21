import React, { useState } from 'react'

function UserForm() {
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

     
  }
  
  const handleChange = () =>{

  }
  return (
    <div>UserForm</div>
  )
}

export default UserForm