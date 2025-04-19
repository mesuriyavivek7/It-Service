import React, { useState, useCallback, useEffect } from 'react'

//Importing images
import PIC from '../../assets/man.png'

//Importing icons
import { FileUp } from 'lucide-react';
import api from '../../api';
import { toast } from 'react-toastify';

import ProfileEdit from '../../components/ProfileEdit';

function Profile() {
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        mobileno:'',
    })

    const [openEditPopUp,setOpenEditPopUp] = useState(false)
    const [openPassPopUp,setOpenPassPopUp] = useState(false) 
    
    const [image,setImage] = useState(null)
    const [preview,setPreview] = useState(null)

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          setImage(file);
          setPreview(URL.createObjectURL(file));
        }
      }, []);
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
          setImage(file);
          setPreview(URL.createObjectURL(file));
        }
    };


    const fetchData = async () =>{
        try{
          const response = await api.get('admin')
          let data = response.data.data
          setFormData((prevData)=>({...prevData,name:data.name,email:data.email,mobileno:data.mobileno}))
        }catch(err){
          console.log(err)
          toast.error(err?.response?.data?.message || "Something went wrong.")
        }
    }

    useEffect(()=>{
        fetchData()
    },[])

  return (
    <div className='flex w-full gap-4 items-start'>
        {
            openEditPopUp &&
            <ProfileEdit user={formData}></ProfileEdit>
        }
        <div className='flex w-1/3 rounded-md bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] flex-col gap-2'>
            <div className='p-4 border-b border-neutral-200'>
                <h1 className='font-medium'>Profile Picture</h1>
            </div>
            <div className='p-4 flex flex-col gap-4'>
                <div className='flex items-center gap-2'>
                    <img src={PIC} alt='admin-pic' className='w-10 h-10 rounded-full'></img>
                    <div className='flex flex-col'>
                       <span>Edit Your Photo</span>
                       <label className='text-blue-500 cursor-pointer' htmlFor='profile'>Update</label>
                       <input id='profile' className='hidden' type='file'></input>
                    </div>
                </div>
                <div className='p-6 border-dashed border rounded-md flex flex-col justify-center items-center'>
                     <FileUp></FileUp>
                     <p className='text-center'>Drag and Drop JPG or PNG</p>
                </div>
            </div>
        </div>
        <div className='flex w-[66%] rounded-md bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] flex-col gap-2'>
            <div className='p-4  border-b border-neutral-200'>
                <h1 className='font-medium'>Edit Personal Information</h1>
            </div>
            <div className='grid grid-cols-2 p-4 gap-4'>
                <div className='flex flex-col gap-2'>
                    <label>Name</label>
                    <input value={formData.name} type='text' readOnly className='outline-none border p-2 border-neutral-400 rounded-md'></input>
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Mobile No</label>
                    <input value={formData.mobileno} type='text' readOnly className='outline-none border p-2 border-neutral-400 rounded-md'></input>
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Email</label>
                    <input value={formData.email} type='text' readOnly className='outline-none border p-2 border-neutral-400 rounded-md'></input>
                </div>
            </div>
            <div className='flex p-4 justify-center items-center gap-2'>
                <button onClick={()=>setOpenEditPopUp(true)} className='bg-blue-500 hover:bg-white hover:text-blue-500 hover:border cursor-pointer hover:border-blue-500 transition-colors duration-300 rounded-md text-white p-1.5 w-36'>Edit</button>
                <button className='bg-button hover:bg-white hover:text-button cursor-pointer hover:border-button hover:border transition-colors duration-300 rounded-md text-white p-1.5 w-36'>Change Password</button>
            </div>
        </div>
    </div>
  )
}

export default Profile