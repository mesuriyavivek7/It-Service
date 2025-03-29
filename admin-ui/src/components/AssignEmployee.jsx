import React, { useEffect, useState } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

//Importing icons
import { X } from 'lucide-react'
import { LoaderCircle } from 'lucide-react';

//Importing data
import { assignEmployeeColumn, fetchAvailableEmployeeData} from '../data/employeeData'
import { toast } from 'react-toastify'
import api from '../api';

function AssignEmployee({issueData,handleCloseBookingPreview}) {

  const [employee,setEmployee] = useState([])
  const [loading,setLoading] = useState(false)
  const [assignLoad,setAssignLoad] = useState(false)
  const [selectedEmployee,setSelectedEmployee] = useState(null)

  useEffect(()=>{
    const fetchData = async ()=>{
      setLoading(true)
      try{
         const data = await fetchAvailableEmployeeData(issueData._id)
         setEmployee(()=>data.map((item)=>({id:item._id,...item})))
      }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
      }finally{
        setLoading(false)
      }
    }

    fetchData()
  },[])

  const handleRowClick = (data) =>{
    setSelectedEmployee(data)
  }

  const handleSubmit = async () =>{
   if(selectedEmployee){
    setAssignLoad(true)
    try{
      let Obj = {
        employeeId:selectedEmployee.id,
        issueId:issueData._id
      }
      const response = await api.post(`employee/assigntoissue`,Obj)
      toast.success('Successfully employee assigned to booking.')
      handleCloseBookingPreview()
    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }finally{
      setAssignLoad(false)
    }
   }
  }


  console.log(selectedEmployee)

  return (
    <div className='fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50'>
        <div className='rounded-md bg-white flex flex-col w-[60%]'>
          <div className='flex items-center border-b p-4 border-neutral-400 justify-between'>
            <h1 className='text-lg font-semibold'>Assign Employee</h1>
            <X onClick={()=>handleCloseBookingPreview()} className='text-red-500 cursor-pointer w-5 h-5'></X>
          </div>
          <div className='flex flex-col gap-3'>
          <div className='h-full shadow-[0_2px_10px_rgba(0,0,0,0.08)] rounded-md bg-white'>
          <Box sx={{
                height: "100%",
                "& .MuiDataGrid-root": {
                  border: "none", // Removes the outer border
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#edf3fd",  // Header background color
                    fontWeight: "bold",  
                    fontSize:'.9rem'
                },    
          }}>
           <DataGrid
            rows={employee}
            columns={assignEmployeeColumn}
            loading={loading}
            rowHeight={70}
            initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
           }}
           pageSizeOptions={[5,10]}
           onRowClick={(params)=>handleRowClick(params.row)}
           disableRowSelectionOnClick
           getRowClassName={(params) => 
            params.id === selectedEmployee?.id ? "bg-blue-400 hover:bg-blue-200" : "" 
           }
          />
         </Box>
         </div>
         <div className='p-4 flex place-content-end'>
             <button onClick={handleSubmit} disabled={!selectedEmployee} className='bg-button w-20 flex justify-center items-center disabled:cursor-not-allowed p-2 rounded-md cursor-pointer disabled:bg-gray-300 text-white'>
               {
                 assignLoad ? 
                   <LoaderCircle className='animate-spin'></LoaderCircle>
                 :
                 <span>Submit</span>
               }
            </button>
         </div>
         </div>
       </div>
    </div>
  )
}

export default AssignEmployee