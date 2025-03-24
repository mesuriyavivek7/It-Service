import api from "../api";
import Tooltip from "@mui/material/Tooltip";


//Importing images
import EMPLOYEE from '../assets/employee.png'
import ASSIGN from '../assets/assign.png'
import CHECKED from '../assets/checked.png'

//Importing icons
import { Pencil } from 'lucide-react';

const formatDate= (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    return `${day}, ${month} ${year}`;
}



export const employeeColumns = (handleOpenEditUser) => [
    {
        field: 'name',
        headerClassName: 'super-app-theme--header',
        headerName: 'Employee Name',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <div className='flex items-center h-full w-full px-2 justify-start'>
            <div className="flex items-center gap-3">
                <img src={EMPLOYEE} alt='person' className='w-9 h-9 rounded-full'></img>
                <span>{params.value}</span>
            </div>
        </div>
        )
    },
    {
        field: 'mobileno',
        headerClassName: 'super-app-theme--header',
        headerName: 'Mobileno',
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'email',
        headerClassName: 'super-app-theme--header',
        headerName: 'Email address',
        flex: 1,
        minWidth: 200,
    },
    {
        field: 'assignedIssues',
        headerClassName: 'super-app-theme--header',
        headerName: 'Assigned Bookings',
        flex: 1,
        minWidth: 200,
        renderCell: (params) =>(
            <div className="flex items-center h-full w-full px-2 justify-start">
              <div className="flex gap-3 items-center justify-center">
                <img src={ASSIGN} alt="Assign" className="w-6 h-6"></img>
                <span className="font-medium text-lg">{params.row?.assignedIssues?.length || 0}</span>
              </div>
            </div>
        )
    },
    {
        field: 'completedIssues',
        headerClassName: 'super-app-theme--header',
        headerName: 'Completed Bookings',
        flex: 1,
        minWidth: 200,
        renderCell: (params) =>(
            <div className="flex items-center h-full w-full px-2 justify-start">
              <div className="flex gap-3 items-center justify-center">
                <img src={CHECKED} alt="total bookings" className="w-6 h-6"></img>
                <span className="font-medium text-lg">{params.value || 0}</span>
              </div>
            </div>
        )
    },
    {
        field: 'aciton',
        headerClassName: 'super-app-theme--header',
        headerName: 'Action',
        flex: 1,
        minWidth: 150,
        renderCell: (params) =>(
          <div className="flex items-center justify-center w-full h-full gap-2">
             <Tooltip title='Edit' arrow>
             <div onClick={()=>handleOpenEditUser(params.row)} className="bg-green-600 w-7 h-7 cursor-pointer rounded-full flex justify-center items-center">
               <Pencil data-tooltip-content="Edit" className="text-white w-4 h-4"></Pencil>
              </div>
            </Tooltip>
          </div>
        )
    }

]



export const fetchEmployeeData = async () =>{
    try{
        const response = await api.get('employee')        
        console.log(response)
        return response.data.data
    }catch(err){
        throw err
    }
}