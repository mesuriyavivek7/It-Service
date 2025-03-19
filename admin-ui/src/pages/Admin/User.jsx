import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

//Importing data
import { userColumns } from '../../data/userData';

//Importing icons
import { Plus } from 'lucide-react';
import { Search } from 'lucide-react';
import { RefreshCcw } from 'lucide-react';


function User() {

  return (
    <div className='flex flex-col gap-4'>

     <div className='bg-white flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]'>
        <button className='bg-button cursor-pointer rounded-md py-1.5 px-2 text-[14px] text-white font-medium flex gap-2 items-center'>
            <Plus className='w-4 h-4'></Plus>
            <span>Add User</span>
        </button>

        <div className='flex items-center gap-2'>
            <div className='flex border border-grayborder gap-2 rounded-md py-1.5 px-2 items-center'>
                <Search className='w-5 h-5 text-navtext'></Search>
                <input className='outline-none placeholder:text-navtext placeholder:text-sm' placeholder='Search User...'></input>
            </div>
            <div className='py-2 px-2 border-grayborder border rounded-md'>
                <RefreshCcw className='w-5 h-5 cursor-pointer'></RefreshCcw>
            </div>
        </div>
     </div>

     <div className='h-full py-4 px-3 custom-shadow rounded-md bg-white'>
         <Box sx={{height:"100%",
          '& .super-app-theme--header': {
            backgroundColor: '#edf3fd',
          },}}>
           <DataGrid
            rows={filteredDoctors}
            columns={columns(handleOpenUpdateData,handleOpenConfirmPopUp)}
            loading={loading}
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