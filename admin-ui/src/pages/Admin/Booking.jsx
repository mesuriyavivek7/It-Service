import React, {useState, useEffect} from 'react'
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import AssignEmployee from '../../components/AssignEmployee';
import { toast } from "react-toastify";
import { Navigate, useNavigate } from 'react-router-dom';

//Importing data
import { bookingColumns, fetchBookingData } from '../../data/bookingData';


import { Search } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import api from '../../api';


function Booking() {
  const [booking,setBooking] = useState([]);
  const [bookingType,setBookingType] = useState('')
  const [filterBooking,setFilterBooking] = useState([])
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const navigate = useNavigate()

  const fetchData = async () =>{
    setLoading(true)
    try{
        const data = await fetchBookingData(bookingType)
        setBooking(()=> data.map((item)=> ({id:item._id, ...item})))
    }catch(err){
        console.log(err)
        console.log(err?.response?.data?.message || "Something went wrong.")
    }finally{
        setLoading(false)
    }
  }

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = booking.filter((book) =>
        Object.values(book).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseQuery)
        )
      );
      setFilterBooking(filtered);
    } else {
      setFilterBooking(booking);
    }
  }, [booking, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [bookingType]);


  const handleOpenBookingPreview = (data) =>{
    setSelectedBooking(data)
    setIsOpenPreview(true)
  }

  const handleCloseBookingPreview = () =>{
    fetchData()
    setSelectedBooking(null)
    setIsOpenPreview(false)
  } 


  const handleRemoveEmployee = async (issueData) =>{
     try{
       let Obj = {
        issueId:issueData.id,
        employeeId:issueData.assignedEmployee._id
       }
       const response = await api.post('employee/removeEmployeeFromIssue',Obj)
       await fetchData()
       toast.success("Successfully employee removed from booking.")
     }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
     }
  }

  const navigateToPreview = (data) =>{
     navigate('preview',{state:data})
  }

  return (
    <div className='flex h-full flex-col gap-4'>
      {
        isOpenPreview && 
        <AssignEmployee issueData={selectedBooking} handleCloseBookingPreview={handleCloseBookingPreview}></AssignEmployee>
      }
      <div className='bg-white flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
        <div>
          <select onChange={(e)=>setBookingType(e.target.value)} value={bookingType} className='border py-1.5 px-2 outline-none rounded-md border-grayborder'>
            <option value={''}>All Bookings</option>
            <option value={'Pending'}>Pending Bookings</option>
            <option value={'Resolved'}>Resolved Bookings</option>
            <option value={'Canceled'}>Canceled Bookings</option>
          </select>
        </div>

        <div className='flex items-center gap-2'>
            <div className='flex border border-grayborder gap-2 rounded-md py-1.5 px-2 items-center'>
                <Search className='w-5 h-5 text-navtext'></Search>
                <input onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} className='outline-none placeholder:text-navtext placeholder:text-sm' placeholder='Search Bookings...'></input>
            </div>
            <div onClick={fetchData} className='py-2 px-2 border-grayborder border rounded-md'>
                <RefreshCcw className='w-5 h-5 cursor-pointer'></RefreshCcw>
            </div>
        </div>
      </div>

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
            rows={filterBooking}
            columns={bookingColumns(handleOpenBookingPreview,handleRemoveEmployee)}
            loading={loading}
            rowHeight={70}
            onRowClick={(params)=>navigateToPreview(params.row)}
            initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
           }}
           pageSizeOptions={[5,10]}
           disableRowSelectionOnClick
          />
         </Box>
      </div>
    </div>
  )
}

export default Booking