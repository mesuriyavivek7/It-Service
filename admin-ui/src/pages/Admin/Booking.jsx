import React, {useState, useEffect} from 'react'
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import EmployeeForm from "../../components/EmployeeForm";
import { toast } from "react-toastify";

//Importing data


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

  return (
    <div>Booking</div>
  )
}

export default Booking