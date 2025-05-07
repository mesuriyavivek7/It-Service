import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

//Importing data
import { employeeColumns, fetchEmployeeData } from "../../data/employeeData";

//Importing icons
import { Plus } from "lucide-react";
import { Search } from "lucide-react";
import { RefreshCcw } from "lucide-react";

function Employee() {
  const navigate = useNavigate()
  const [employee, setEmployee] = useState([]);
  const [filterEmployee, setFilterEmployee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployeeData();
      setEmployee(() => data.map((item) => ({ id: item._id, ...item })));
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = employee.filter((user) =>
        Object.values(user).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(lowerCaseQuery)
        )
      );
      setFilterEmployee(filtered);
    } else {
      setFilterEmployee(employee);
    }
  }, [employee, searchQuery]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleRedirectAddUser = () =>{
    navigate('/admin/addemployee')
  }
 
  const handleRedirectEditUser= (data) =>{
     console.log("state data---->",data)
     navigate('/admin/addemployee',{state:data})
  }


  return (
    <div className='flex h-full flex-col gap-4'>
     <div className='bg-white flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
        <button onClick={()=>handleRedirectAddUser()} className='bg-button cursor-pointer rounded-md py-1.5 px-2 text-[14px] text-white font-medium flex gap-2 items-center'>
            <Plus className='w-4 h-4'></Plus>
            <span>Add Employee</span>
        </button>

        <div className='flex items-center gap-2'>
            <div className='flex md:w-auto w-36 border border-grayborder gap-2 rounded-md py-1.5 px-2 items-center'>
                <Search className='w-5 h-5 text-navtext'></Search>
                <input onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} className='outline-none placeholder:text-navtext placeholder:text-sm' placeholder='Search User...'></input>
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
            rows={filterEmployee}
            columns={employeeColumns(handleRedirectEditUser)}
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
  );
}

export default Employee;
