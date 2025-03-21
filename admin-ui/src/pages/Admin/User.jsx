import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import UserForm from '../../components/UserForm';
import { toast } from 'react-toastify';

//Importing data
import { userColumns, fetchUserData } from '../../data/userData';

//Importing icons
import { Plus } from 'lucide-react';
import { Search } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';


function User() {

  const [users,setUsers] = useState([])
  const [filterUsers,setFilterUsers] = useState([])
  const [loading,setLoading] = useState(false)
  const [searchQuery,setSearchQuery] = useState('')
  const [isOpenUserForm,setIsOpenUserForm] = useState(false)

  const fetchData = async () =>{
    try{
      setLoading(true)
      const data = await fetchUserData()
      setUsers(()=>data.map((item)=>({id:item._id,...item})))
    }catch(err){
      console.log(err)
      toast.error(err.response?.data?.message || "Something went wrong.")
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        Object.values(user).some(value => 
          typeof value === 'string' && value.toLowerCase().includes(lowerCaseQuery)
        )
      );
      setFilterUsers(filtered);
    } else {
      setFilterUsers(users);
    }
  }, [users, searchQuery]);


  useEffect(()=>{
     fetchData()
  },[])

  return (
    <div className='flex h-full flex-col gap-4'>
     {
      isOpenUserForm && 
      <UserForm setIsOpenUserForm={setIsOpenUserForm}></UserForm>
     }
     <div className='bg-white flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
        <button onClick={()=>setIsOpenUserForm(true)} className='bg-button cursor-pointer rounded-md py-1.5 px-2 text-[14px] text-white font-medium flex gap-2 items-center'>
            <Plus className='w-4 h-4'></Plus>
            <span>Add User</span>
        </button>

        <div className='flex items-center gap-2'>
            <div className='flex border border-grayborder gap-2 rounded-md py-1.5 px-2 items-center'>
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
            rows={filterUsers}
            columns={userColumns}
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

export default User