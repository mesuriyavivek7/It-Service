import { X } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api'


function ServiceForm({handleClose,service}) {
  const [file,setFile] = useState(null)
  const [preview,setPreview] = useState(null)
  const [errors,setErrors] = useState({})

  const [formData,setFormData] = useState({
    service_name:service?.service_name,
    price:service?.price,
  })

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (!validImageTypes.includes(selectedFile.type)) {
      toast.error('Only image files (jpg, jpeg, png, webp) are allowed.');
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const validateData = () =>{
     let newErrors = {}

     if(!formData.service_name) newErrors.service_name = 'Service name is required.'

     if(formData.price===0 || formData.price==='') newErrors.price = 'Price is required.'

     return Object.keys(newErrors).length===0
  }

  const handleChange = (e) =>{
    const {name,value} = e.target

    setFormData((prev)=>({...prev,[name]:value}))

    setErrors((prev)=>{
      let newErrors = {...prev}

      if(name==="service_name" && value.trim()==="") {
          newErrors.service_name = "Service name is required."
      }else{
          delete newErrors.service_name
      }


      if(name==="price" && (value===0 || value==='')){
          newErrors.price = 'Price is required.'
      }else{
        delete newErrors.price
      }

      return newErrors

    })
  }

  const handleSubmit = async () =>{
      if(validateData()){
        try{
          let fileData = new FormData()
          fileData.append('service_name',formData.service_name)
          fileData.append('price',formData.price)
          if(preview && file){
            fileData.append('service',file)
          }
          const res = await api.put(`service/${service._id}`,fileData,{
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          toast.success("Service changed sucessfully")
          handleClose()
        }catch(err){
          console.log(err)
          toast.error(err?.response?.data?.message || "Something went wrong.")
        }
      }
  }

  const handleAdd = async () =>{
    try{
      let fileData = new FormData()
       fileData.append("service_name",formData.service_name)
       fileData.append('price',formData.price)
       if(preview && file){
         fileData.append('service',file)
       }

       const res = await api.post(`service`,fileData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success("New Service added successfully.")
      handleClose()
    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }
  }


  const getLabelText = () => {
    if (service) return "Change Image";
    if (preview && file) return "Change Image";
    return "Choose Image";
  };


  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50'>
        <div className='bg-white w-96 rounded-md p-4 gap-4 flex flex-col'>
             <div className='flex justify-between items-center'>
                 <h1 className='text-xl font-medium'>{service ? "Edit Service" : "Add Service"}</h1>
                 <X onClick={handleClose} className='text-red-500 cursor-pointer'></X>
             </div>
             <div className='flex mb-2 flex-col gap-2'>
                <span className='text-sm font-medium'>Service Image</span>
                <div className='w-full flex items-center justify-center'>
                    {
                      (!service && !preview && !file) ?
                      <div className='w-52 h-36 flex justify-center items-center'>
                        <span>No Image</span>
                      </div> :
                      (!service && preview && file) ?
                      <div className='w-52 h-36'>
                        <img src={preview} className='w-full h-40'></img>
                      </div> :
                      <div className='w-52 h-36'>
                         <img src={preview?preview:`${import.meta.env.VITE_APP_API_IMAGE_URL}/${service?.service_image?.filePath}`} className='w-full h-full'></img>
                      </div>
                    }
                </div>
                <input onChange={handleFileChange} id='image' type='file' className='hidden'></input>
                <label htmlFor='image' className='p-1  cursor-pointer px-2 text-sm border-bordercolor/25 border rounded-md'>{getLabelText()}</label>
             </div>
             <div className='flex mb-2 flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                 <label htmlFor='service_name' className='text-sm'>Service Name <span className='text-sm text-red-500'>*</span></label>
                 <div className='flex flex-col gap-1'>
                   <input id='service_name' onChange={handleChange} name='service_name' value={formData.service_name} type='text' className='p-2 text-sm outline-none border-bordercolor border rounded-md' placeholder='Enter service name'></input>
                   {errors.service_name && <span className='text-sm text-red-500'>{errors.service_name}</span>}
                 </div>
              </div>

              <div className='flex flex-col gap-2'>
                <label htmlFor='price' className='text-sm'>Price (₹) <span className='text-sm text-red-500'>*</span></label>
                <div className='flex flex-col gap-1'>
                  <input onChange={handleChange} type='number' id='price' name='price' value={formData.price} className='p-2 text-sm outline-none border-bordercolor border rounded-md' placeholder='Enter service Price'></input>
                  {errors.price && <span className='text-sm text-red-500'>{errors.price}</span>}
                </div>
              </div>

             </div>
             <button onClick={service?handleSubmit:handleAdd} className='bg-button cursor-pointer text-white font-medium p-2 rounded-md'>{service ? "Save Changes" : "Add"}</button>
        </div>
    </div>
  )
}

export default ServiceForm