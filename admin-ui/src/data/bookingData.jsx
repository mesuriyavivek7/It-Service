import api from "../api";
import Tooltip from "@mui/material/Tooltip";

//Importing images
import REMOTE from '../assets/remote.png'
import ONSITE from '../assets/onsite.png'
import USER from '../assets/user.png'
import EMP from '../assets/employee.png'
import LAPTOP from '../assets/laptop.png'
import DATE from '../assets/calendar.png'
import TIME from '../assets/time.png'
import ADDRESS from '../assets/location.png'

//Importing icons
import { Pencil } from 'lucide-react';

const formatDate= (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    return `${day}, ${month} ${year}`;
}

const getStatusStyle = (status) =>{
    switch(status){
      case 'Resolved':
        return "bg-green-500"
          
      case 'Canceled':
        return "bg-red-500"

      case 'Pending':
        return "bg-yellow-500"

      default:
        return "bg-blue-500"

    }
}


export const bookingColumns = (handleOpenBookingPreview) => [
    {
        field: 'service',
        headerClassName: 'super-app-theme--header',
        headerName: 'Service',
        flex: 1,
        minWidth: 220,
        renderCell: (params) =>(
            <div className="w-full h-full flex justify-start">
              <div className="flex justify-center items-center gap-2">
                <img className="w-12 h-12 rounded-full" src={params.value.service_name==="Onsite Support"?ONSITE:REMOTE}></img>
                <span>{params.value.service_name}</span>
              </div>
            </div>
        )
    },
    {
        field: 'added_by',
        headerClassName: 'super-app-theme--header',
        headerName: 'User',
        flex: 1,
        minWidth: 220,   
        renderCell: (params) => (
            <div className="w-full h-full flex justify-start">
               <div className="flex justify-center items-center gap-2">
                  <img src={params?.value?.profilePic?.filePath?`${import.meta.env.VITE_APP_API_IMAGE_URL}/${params.value.profilePic.filePath}`:USER} className="w-7 h-7 rounded-full "></img>
                  <span>{params.value.name}</span>
               </div>
            </div>
        )
    },
    {
        field: 'assignedEmployee',
        headerClassName: 'super-app-theme--header',
        headerName: 'Assigned Employee',
        flex: 1,
        minWidth: 220,  
        renderCell: (params) => (
                params.value?
                <div className="flex w-full h-full">
                   <img src={EMP} className="w-4 h-4"></img>
                   <span>{params.value.name}</span>
                </div>:
                <div className="flex justify-start items-center w-full h-full">
                    <button onClick={()=>handleOpenBookingPreview(params.row)} className="bg-button flex justify-center items-center p-1.5 cursor-pointer rounded-md h-8 text-white font-medium">Assign Employee</button>
                </div>
        )
    },
    {
        field: 'date',
        headerClassName: 'super-app-theme--header',
        headerName: 'Date',
        flex: 1,
        minWidth: 210,     
        renderCell: (params) => (
            <div className="flex justify-start items-center">
                <div className="flex justify-center items-center gap-2">
                    <img src={DATE} className="w-6 h-6 "></img>
                   <span>{formatDate(params.value)}</span>
                </div>
            </div>
        )
    },
    {
        field: 'time',
        headerClassName: 'super-app-theme--header',
        headerName: 'Time',
        flex: 1,
        minWidth: 200,     
        renderCell: (params) => (
            <div className="flex justify-start items-center">
                <div className="flex justify-center items-center gap-2">
                    <img src={TIME} className="w-6 h-6"></img>
                    <span>{params.value.time}</span>
                </div>
            </div>
        )
    },
    {
        field: 'address',
        headerClassName: 'super-app-theme--header',
        headerName: 'Address',
        flex: 1,
        minWidth: 220,   
        renderCell: (params) => (
            <div className="flex w-full h-full justify-start">
                {
                    params.value ? 
                    <div className="flex gap-2 justify-center items-center">
                      <img src={ADDRESS} className="w-7 h-7"></img>
                      <span>{params.value.name}</span>
                    </div>
                    : <span>-</span>
                }

            </div>
        )
    },
    {
        field:'device',
        headerClassName: 'super-app-theme--header',
        headerName: 'Device',
        flex: 1,
        minWidth: 180,  
        renderCell: (params) => (
            <div className="w-full h-full flex justify-start">
               <div className="flex gap-2 items-center justify-center">
                <img src={LAPTOP} className="w-6 h-6"></img>
                <span>{params?.value?.brand && params.value.brand} <small>({params?.value?.device_type && params.value.device_type})</small></span>
               </div>
            </div>
        )
    },
    {
        field:'issue_description',
        headerClassName: 'super-app-theme--header',
        headerName: 'Description',
        flex: 1,
        minWidth: 240,  
    },
    {
        field:'status',
        headerClassName: 'super-app-theme--header',
        headerName: 'Status',
        flex: 1,
        minWidth: 200,  
        renderCell: (params) =>(
            <div className="flex w-full h-full justify-start items-center">
            <span className={`text-white w-20 h-8 font-medium p-1 flex justify-center items-center rounded-md ${getStatusStyle(params.value)}`}>
              {params.value}
            </span>
            </div>
        )
    },
    {
        field:'createdAt',
        headerClassName: 'super-app-theme--header',
        headerName: 'Created Date',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
            <span>{formatDate(params.value)}</span>
        )
    }

]


export const fetchBookingData = async () =>{
    try{
       const response = await api.get('/issue')
       console.log(response)
       return response.data.data
    }catch(err){
        throw err
    }
}