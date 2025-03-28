import React, {useState, useEffect} from 'react'
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import AssignEmployee from '../../components/AssignEmployee';
import { toast } from "react-toastify";

//Importing data
import { bookingColumns, fetchBookingData } from '../../data/bookingData';


import { Search } from "lucide-react";
import { RefreshCcw } from "lucide-react";


function Booking() {
  const [booking,setBooking] = useState([]);
  const [filterBooking,setFilterBooking] = useState([])
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchData = async () =>{
    setLoading(true)
    try{
        const data = await fetchBookingData()
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
  }, []);


  const handleOpenBookingPreview = (data) =>{
    setSelectedBooking(data)
    setIsOpenPreview(true)
  }

  const handleCloseBookingPreview = (data) =>{
    setSelectedBooking(null)
    setIsOpenPreview(false)
  } 

  return (
    <div className='flex h-full flex-col gap-4'>
      {
        isOpenPreview && 
        <AssignEmployee></AssignEmployee>
      }
      <div className='bg-white flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
        <div></div>

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
            columns={bookingColumns(handleOpenBookingPreview)}
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
           disableRowSelectionOnClick
          />
         </Box>
      </div>
    </div>
  )
}

export default Booking