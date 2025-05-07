import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

//Importing icons
import { LoaderCircle, X } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { Eye } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';


import { toast } from 'react-toastify';
import api from '../api';
import { useNavigate } from 'react-router-dom';


function EmployeeForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const [departments,setDepartments] = useState([])
  const [designations,setDesignations] = useState([])
  const [formData,setFormData] = useState({
    employeeCode:'',
    firstName:'',
    lastName:'',
    mobileno:'',
    email:'',
    password:'',
    dateOfBirth:'',
    gender:'',
    HireDate:'',
    departmentId:'',
    designationId:'',
    reportingToId:'',
    salary:'',
    branch:'',
    adharCard:'',
    panCard:'',
    address1:'',
    address2:'',
    area:'',
    city:'',
    state:'',
    pincode:'',
    maritalStatus:'',
    bloodGroup:'',
    emergencyNumber:'',
    emergencyContactPerson:''
  })  

  const [loading,setLoading] = useState(false)
  const [errors,setErrors] = useState({})
  const [showPassword,setShowPassword] = useState(false)

  useEffect(()=>{
     if(location.state){ 
       setFormData({
        name:location.state.name,
        mobileno:location.state.mobileno,
        email:location.state.email,
       })
     }
  },[])

  const validateData = () =>{
    let newErrors = {}
    let emailRegax = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let adharcardRegax = /^[2-9]{1}[0-9]{11}$/
    let pancardRegax = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/

    if(!formData.employeeCode) newErrors.employeeCode = 'employee code is required.'
    if(!formData.firstName) newErrors.firstName="firstname is required."
    if(!formData.lastName) newErrors.lastName="lastname is required."
    if(!formData.mobileno) newErrors.mobileno="Mobile no is required."
    if(!formData.email) newErrors.email = 'Email address is required.'
    if(!emailRegax.test(formData.email)) newErrors.email="Email address is invalid."
    if(!location.state && !formData.password) newErrors.password = "Password is required."
    if(!formData.branch) newErrors.branch = 'Branch is required.'
    if(!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required."
    if(!formData.designationId) newErrors.designationId="Designation is required."
    if(!formData.departmentId) newErrors.departmentId = "Department is required."
    if(!formData.salary) newErrors.salary = "Salary is required."
    if(!formData.gender) newErrors.gender = "Gender is required."
    if(!formData.adharCard) newErrors.adharCard = "Adharcard is required."
    if(!adharcardRegax.test(formData.adharCard)) newErrors.adharCard = "Invalid adharcard number. Its must be 12 digit number."
    if(!formData.panCard) newErrors.panCard = 'Pancard is required.'
    if(!pancardRegax.test(formData.panCard)) newErrors.panCard = "Invalid pancard number. It must be in format 'ABCDE1234F'"
    if(!formData.address1) newErrors.address1 = "Address1 is required."
    if(!formData.area) newErrors.area = "Area is required."
    if(!formData.city) newErrors.city = "City nam is required."
    if(!formData.state) newErrors.state = "State is required."
    if(!formData.pincode) newErrors.pincode = 'Pincode is required.'
    else if(formData.pincode.length!==6) newErrors.pincode = 'Invalid pincode.'
    if(!formData.maritalStatus) newErrors.maritalStatus = "Marital status is required."
    if(!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required."
    if(!formData.emergencyNumber) newErrors.emergencyNumber = "Emergency number is required."
    if(!formData.emergencyContactPerson) newErrors.emergencyContactPerson = "Emergency contact person name is required."


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
      let adharcardRegax = /^[2-9]{1}[0-9]{11}$/;
      let pancardRegax = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
      const newErrors = { ...prevErrors };

      if (name === "employeeCode" && !value.trim()) {
        newErrors.employeeCode = "Please enter employee code.";
      } else {
        delete newErrors.employeeCode;
      }
  
      // Name validation
      if (name === "firstName" && !value.trim()) {
        newErrors.firstName = "Please enter employee firstname.";
      } else {
        delete newErrors.firstName;
      }

      if (name === "lastName" && !value.trim()) {
        newErrors.lastName = "Please enter employee lastname.";
      } else {
        delete newErrors.lastName;
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
      if (!location.state && name === "password") {
        if (!value.trim()) {
          newErrors.password = "Please enter password.";
        } else {
          delete newErrors.password;
        }
      }

      if (name === "branch" && !value.trim()) {
        newErrors.branch = "Please enter branch.";
      } else {
        delete newErrors.branch;
      }

      if (name === "dateOfBirth" && !value.trim()) {
        newErrors.dateOfBirth = "Please enter date Of birth.";
      } else {
        delete newErrors.dateOfBirth;
      }

      if (name === "designationId" && !value.trim()) {
        newErrors.designationId = "Please select designation.";
      } else {
        delete newErrors.designationId;
      }

      if (name === "departmentId" && !value.trim()) {
        newErrors.departmentId = "Please select department.";
      } else {
        delete newErrors.departmentId;
      }

      if (name === "salary" && !value.trim()) {
        newErrors.salary = "Please enter salary.";
      } else {
        delete newErrors.salary;
      }

      if (name === "gender" && !value.trim()) {
        newErrors.gender = "Please select gender.";
      } else {
        delete newErrors.gender;
      }

      if(name==='adharCard'){
        if (name === "adharCard" && !value.trim()) {
          newErrors.adharCard = "Please enter salary.";
        } else if (!adharcardRegax.test(value)) {
          newErrors.adharCard = "Invalid adharcard number. Its must be 12 digit number.";
        } else {
          delete newErrors.adharCard;
        }
      }

      if(name==="panCard"){
        if (name === "panCard" && !value.trim()) {
          newErrors.panCard = "Please enter salary.";
        } else if (!pancardRegax.test(value)) {
          newErrors.panCard = "Invalid pancard number. It must be in format 'ABCDE1234F'.";
        } else {
          delete newErrors.panCard;
        }
      }

      if (name === "address1" && !value.trim()) {
        newErrors.address1 = "Please enter address1.";
      } else {
        delete newErrors.address1;
      }

      if (name === "area" && !value.trim()) {
        newErrors.area = "Please enter area.";
      } else {
        delete newErrors.area;
      }

      if (name === "city" && !value.trim()) {
        newErrors.city = "Please enter city.";
      } else {
        delete newErrors.city;
      }

      if (name === "state" && !value.trim()) {
        newErrors.state = "Please enter state.";
      } else {
        delete newErrors.state;
      }

      if(name==="pincode"){
        if (name === "pincode" && !value.trim()) {
          newErrors.pincode = "Please enter pincode.";
        } else if(value.length!==6){
          newErrors.pincode = "Invalid pincode."
        }else {
          delete newErrors.pincode;
        }
      }

      if (name === "maritalStatus" && !value.trim()) {
        newErrors.maritalStatus = "Please select marital status.";
      } else {
        delete newErrors.maritalStatus;
      }

      if (name === "bloodGroup" && !value.trim()) {
        newErrors.bloodGroup = "Please select blood group.";
      } else {
        delete newErrors.bloodGroup;
      }

      if (name === "emergencyNumber" && !value.trim()) {
        newErrors.emergencyNumber = "Please enter emergency number.";
      } else {
        delete newErrors.emergencyNumber;
      }

      if (name === "emergencyContactPerson" && !value.trim()) {
        newErrors.emergencyContactPerson = "Please enter emergency person name.";
      } else {
        delete newErrors.emergencyContactPerson;
      }
  
      return newErrors;
    });
  };
  
  const handleSubmitdata = async () =>{
    if(validateData()){
      console.log(formData)
      setLoading(true)
      try{
         const response = await api.post('/employee',{...formData,mobileno:`+${formData.mobileno}`,emergencyNumber:`+${formData.emergencyNumber}`})
         const emailResponse = await api.post(`/mail/send-employee-register/${response.data.data._id}`,{password:formData.password})
         setFormData(
          {employeeCode:'',
          firstName:'',
          lastName:'',
          mobileno:'',
          email:'',
          password:'',
          dateOfBirth:'',
          gender:'',
          HireDate:'',
          departmentId:'',
          designationId:'',
          reportingToId:'',
          salary:'',
          branch:'',
          adharCard:'',
          panCard:'',
          address1:'',
          address2:'',
          area:'',
          city:'',
          state:'',
          pincode:'',
          maritalStatus:'',
          bloodGroup:'',
          emergencyNumber:'',
          emergencyContactPerson:''
          })
         toast.success("New employee created successfully.")
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


  const fetchDesignations = async () =>{
    try{
        const response = await api.get('/empconfigure/get-designations')
        setDesignations(response.data.data)
    }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
    }
 }

 const fetchDepartments = async () =>{
    try{
        const response = await api.get('/empconfigure/get-departments')
        setDepartments(response.data.data)
    }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
    }
 }

  useEffect(()=>{
    fetchDesignations()
    fetchDepartments()
  },[])

  const handleNavigateBack = () =>{
     navigate('/admin/employee')
  }
 
  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='bg-white flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
         <div className='flex items-center gap-2'>
            <ChevronLeft className='cursor-pointer' onClick={handleNavigateBack}></ChevronLeft>
            <h1 className='text-lg font-semibold'>Create New Employee</h1>
         </div>
      </div>
      <div className='grid grid-cols-2 items-start p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)] bg-white rounded-md gap-4'>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='name'>Employee code <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='employeeCode' value={formData.employeeCode} onChange={handleChange} id='employeeCode' type='text' placeholder='Enter Employee code' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.employeeCode && <span className='text-sm text-red-500'>{errors.employeeCode}</span>}
          </div>
        </div>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='name'>Branch <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='branch' value={formData.branch} onChange={handleChange} id='branch' type='text' placeholder='Enter Branch' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.branch && <span className='text-sm text-red-500'>{errors.branch}</span>}
          </div>
        </div>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='name'>First name <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='firstName' value={formData.firstName} onChange={handleChange} id='firstName' type='text' placeholder='Enter firstname' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.firstName && <span className='text-sm text-red-500'>{errors.firstName}</span>}
          </div>
        </div>
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='name'>Last name <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='lastName' value={formData.lastName} onChange={handleChange} id='lastName' type='text' placeholder='Enter lastname' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.lastName && <span className='text-sm text-red-500'>{errors.lastName}</span>}
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
              border:'1px solid #d4d4d4',
              borderRadius: '6px'
             }}
             inputStyle={{
              width: "94%", // Full width
              marginLeft:'6%',
              padding: "8px", // Add padding
              borderRadius: "6px", // Rounded corners
              fontSize: "16px", // Adjust font size
            }}
            buttonStyle={{
              borderRadius: "6px 0 0 6px", // Match input border radius
              background:'white',
              borderRight:'1px solid #d4d4d4'
            }}
          />
          {errors.mobileno && <span className='text-sm text-red-500'>{errors.mobileno}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='email'>Email <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='email' value={formData.email} onChange={handleChange} id='email' type='text' placeholder='Enter Email' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.email && <span className='text-sm text-red-500'>{errors.email}</span>}
          </div>
        </div>
       {
        !location.state && 
        <div className='flex flex-col gap-1.5'>
         <label htmlFor='password'>Password <span className='text-sm text-red-500'>*</span></label>
         <div className='relative flex flex-col gap-1'>
            <input name='password'  value={formData.password} onChange={handleChange} id='password' type={showPassword?"text":"password"} placeholder='Enter Password' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            <span onClick={()=>setShowPassword((prevData)=>!prevData)} className='absolute right-2 top-3 cursor-pointer'>{!showPassword?<Eye className='w-5 h-5'></Eye>:<EyeOff className='w-5 h-5'></EyeOff>}</span>
            {errors.password && <span className='text-sm text-red-500'>{errors.password}</span>}
         </div>
        </div>
       }
        <div className='flex flex-col gap-1.5'>
          <label htmlFor='dateOfBirth'>Date Of Birth <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='dateOfBirth' value={formData.dateOfBirth} onChange={handleChange} id='dateOfBirth' type='date'  className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.dateOfBirth && <span className='text-sm text-red-500'>{errors.dateOfBirth}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='dateOfBirth'>Gender <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <select name='gender' value={formData.gender} onChange={handleChange} id='gender' className='p-2 outline-none border border-neutral-300 rounded-md'>
              <option value={''}> --- Select Gender ---</option>
              <option value={'Male'}>Male</option>
              <option value={'Female'}>Female</option>
            </select>
            {errors.gender && <span className='text-sm text-red-500'>{errors.gender}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='salary'>Salary <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='salary' value={formData.salary} onChange={handleChange} id='salary' placeholder='Enter salary' type='text' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.salary && <span className='text-sm text-red-500'>{errors.salary}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='designationId'>Designation <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <select name='designationId' value={formData.designationId} onChange={handleChange} id='designationId' className='p-2 outline-none border border-neutral-300 rounded-md'>
              <option value={''}> --- Select Designation ---</option>
              {
                designations.map((item,index)=>(
                  <option key={index} value={item._id}>{item.designation_name}</option>
                ))
              }
            </select>
            {errors.designationId && <span className='text-sm text-red-500'>{errors.designationId}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='departmentId'>Department <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <select name='departmentId' value={formData.departmentId} onChange={handleChange} id='departmentId' className='p-2 outline-none border border-neutral-300 rounded-md'>
              <option value={''}> --- Select Department ---</option>
              {
                departments.map((item,index) => (
                  <option key={index} value={item._id}>{item.department_name}</option>
                ))
              }
            </select>
            {errors.departmentId && <span className='text-sm text-red-500'>{errors.departmentId}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='adharCard'>Adharcard No<span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='adharCard' value={formData.adharCard} onChange={handleChange} id='adharCard' placeholder='Enter Adharcard' type='text' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.adharCard && <span className='text-sm text-red-500'>{errors.adharCard}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='panCard'>Pancard No<span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='panCard' value={formData.panCard} onChange={handleChange} id='adharCard' placeholder='Enter Pancard' type='text' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.panCard && <span className='text-sm text-red-500'>{errors.panCard}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='address1'>Address1<span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='address1' value={formData.address1} onChange={handleChange} id='address1' placeholder='Enter Address1' type='text' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.address1 && <span className='text-sm text-red-500'>{errors.address1}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='address2'>Address2</label>
          <div className='flex flex-col gap-1'>
            <input name='address2' value={formData.address2} onChange={handleChange} id='address2' placeholder='Enter Address2' type='text' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.address2 && <span className='text-sm text-red-500'>{errors.address2}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='area'>Area<span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='area' value={formData.area} onChange={handleChange} id='area' placeholder='Enter area' type='text' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.area && <span className='text-sm text-red-500'>{errors.area}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='city'>City<span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='city' value={formData.city} onChange={handleChange} id='city' placeholder='Enter city' type='text' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.city && <span className='text-sm text-red-500'>{errors.city}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='state'>State<span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='state' value={formData.state} onChange={handleChange} id='state' placeholder='Enter state' type='text' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.state && <span className='text-sm text-red-500'>{errors.state}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='pincode'>Pincode<span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='pincode' value={formData.pincode} onChange={handleChange} id='pincode' placeholder='Enter pincode' type='number' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.pincode && <span className='text-sm text-red-500'>{errors.pincode}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='maritalStatus'>Marital Status <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <select name='maritalStatus' value={formData.maritalStatus} onChange={handleChange} id='maritalStatus' className='p-2 outline-none border border-neutral-300 rounded-md'>
              <option value={''}> --- Select Marital Status ---</option>
              <option value={'Single'}>Single</option>
              <option value={'Married'}>Married</option>
              <option value={'Divorced'}>Divorced</option>
              <option value={'Widowed'}>Widowed</option>
            </select>
            {errors.maritalStatus && <span className='text-sm text-red-500'>{errors.maritalStatus}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label htmlFor='bloodGroup'>Blood Group <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <select name='bloodGroup' value={formData.bloodGroup} onChange={handleChange} id='bloodGroup' className='p-2 outline-none border border-neutral-300 rounded-md'>
              <option value={''}> --- Select Blood Group ---</option>
              <option value={"A+"}>A+</option>
              <option value={"A-"}>A-</option>
              <option value={"B+"}>B+</option>
              <option value={"B-"}>B-</option>
              <option value={"AB+"}>AB+</option>
              <option value={"AB-"}>AB-</option>
              <option value={"O+"}>O+</option>
              <option value={"O-"}>O-</option>
            </select>
            {errors.bloodGroup && <span className='text-sm text-red-500'>{errors.bloodGroup}</span>}
          </div>
        </div>


        <div className='flex flex-col gap-1.5'>
          <label htmlFor='pincode'>Emergency Contact Person<span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
            <input name='emergencyContactPerson' value={formData.emergencyContactPerson} onChange={handleChange} id='emergencyContactPerson' placeholder='Enter emergency contact person' type='text' className='p-2 outline-none border border-neutral-300 rounded-md'></input>
            {errors.emergencyContactPerson && <span className='text-sm text-red-500'>{errors.emergencyContactPerson}</span>}
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label>Emergency Contact Number <span className='text-sm text-red-500'>*</span></label>
          <div className='flex flex-col gap-1'>
          <PhoneInput
             country={'in'}
             value={formData.emergencyNumber}
             onChange={phone => handleChange({target:{name:'emergencyNumber',value:phone}})}
             placeholder='Enter Emergency Mobile no'
             containerStyle={{
              width: "100%", // Adjust width as needed
              border:'1px solid #d4d4d4',
              borderRadius: '6px'
             }}
             inputStyle={{
              width: "94%", // Full width
              marginLeft:'6%',
              padding: "8px", // Add padding
              borderRadius: "6px", // Rounded corners
              fontSize: "16px", // Adjust font size
            }}
            buttonStyle={{
              borderRadius: "6px 0 0 6px", // Match input border radius
              background:'white',
              borderRight:'1px solid #d4d4d4'
            }}
          />
          {errors.emergencyNumber && <span className='text-sm text-red-500'>{errors.emergencyNumber}</span>}
          </div>
        </div>

       </div>
       <div className='flex bg-white p-2 justify-center items-center'>
        <button onClick={location.state?handleEditEmployee:handleSubmitdata} className='text-white mt-2 w-36 flex justify-center items-center cursor-pointer font-semibold p-1.5 rounded-md bg-button'>
          {
            loading ? 
            <div className='flex items-center gap-2'>
               <LoaderCircle className='animate-spin'></LoaderCircle>
               ...Loading
            </div>
            :<span>{location.state?"Save Changes":"Submit"}</span>
          }
        </button>
       </div>
    </div>
  )
}

export default EmployeeForm