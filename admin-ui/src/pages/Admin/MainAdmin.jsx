import React, { useEffect, useState } from 'react'
import {toast} from 'react-toastify'
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import api from '../../api';
import { useNavigate } from 'react-router-dom';

//Importing icons
import { RefreshCcw } from 'lucide-react';

import { latestBookings , fetchBookingData} from '../../data/bookingData';

const MetricCard = ({ icon, title, value, change, isPositive }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${icon.bgColor}`}>
          {icon.element}
        </div>
        <span className="text-gray-500">{title}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-4xl font-bold">{value}</span>
        <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
};


function MainAdmin() {
  const navigate = useNavigate()
  const [userData,setUserData] = useState(null)
  const [employeeData,setEmployeeData] = useState(null)
  const [issueData,setIssueData] = useState(null)
  const [booking,setBooking] = useState([]);
  const [loading,setLoading] = useState(false)
  let bookingType = ''

  const fetchData = async () =>{
    setLoading(true)
    try{
        const data = await fetchBookingData(bookingType)
        setBooking(()=> data.map((item)=> ({id:item._id, ...item})).slice(0,5))
    }catch(err){
        console.log(err)
        console.log(err?.response?.data?.message || "Something went wrong.")
    }finally{
        setLoading(false)
    }
  }

  const fetchDashboardSummery = async () =>{
    try{
      const [userResponse,employeeResponse,issueResponse] = await Promise.all([api.get('user/dashboard-summery'),api.get('employee/dashborad-summery'),api.get('issue/dashboard-summery')])

      setUserData(userResponse.data)
      setEmployeeData(employeeResponse.data)
      setIssueData(issueResponse.data)

    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }
  }

  useEffect(()=>{
     fetchDashboardSummery()
     fetchData()
  },[])

  const handleNavigate = () =>{
     navigate('/admin/booking')
  }

  const metrics = [
    {
      icon: {
        element: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7.963 7.963 0 0112 15c2.21 0 4.21.896 5.879 2.341M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      ,
        bgColor: 'bg-blue-500',
      },
      title: 'Total Employee',
      value: employeeData?.total,
      change: employeeData?.change,
      isPositive: employeeData?.isPositive,
    },
    {
      icon: {
        element: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>,
        bgColor: 'bg-purple-500',
      },
      title: 'New Users',
      value: userData?.total,
      change: userData?.change,
      isPositive: userData?.isPositive,
    },
    {
      icon: {
        element: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-6 4h.01M21 11.5V6a2 2 0 00-2-2h-2V3a1 1 0 10-2 0v1H9V3a1 1 0 10-2 0v1H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2v-7.5z" />
      </svg>
      ,
        bgColor: 'bg-pink-500',
      },
      title: 'Total Bookings',
      value: issueData?.total,
      change: issueData?.change,
      isPositive: issueData?.isPositive,
    },
    {
      icon: {
        element: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>,
        bgColor: 'bg-orange-500',
      },
      title: 'Conversion Rate',
      value: '12.8%',
      change: 0.5,
      isPositive: true,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            icon={metric.icon}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            isPositive={metric.isPositive}
          />
        ))}
      </div>

      <div className='p-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.08)] rounded-md bg-white'>
           <h1 className='font-medium text-lg'>Latest Bookings</h1>
           <div onClick={fetchData} className='py-2 px-2 border-grayborder border rounded-md'>
                <RefreshCcw className='w-5 h-5 cursor-pointer'></RefreshCcw>
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
            rows={booking}
            columns={latestBookings}
            loading={loading}
            rowHeight={70}
            onRowClick={handleNavigate}
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

export default MainAdmin