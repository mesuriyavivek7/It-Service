import api from "../api";

const formatDate= (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    return `${day}, ${month} ${year}`;
}

//Importing images
import PERSON from '../assets/user.png'
import BOOKING from '../assets/booking.png'
import CHECKED from '../assets/checked.png'
import PENDING from '../assets/clock.png'
import CLOSE from '../assets/button.png'

export const userColumns = [
    {
        field: 'name',
        headerClassName: 'super-app-theme--header',
        headerName: 'User Name',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => (
          <div className='flex items-center h-full w-full px-2 justify-start'>
            <div className="flex items-center gap-3">
                <img src={PERSON} alt='person' className='w-9 h-9 rounded-full'></img>
                <span>{params.value}</span>
            </div>
        </div>
        )
    },
    {
        field: 'mobileno',
        headerClassName: 'super-app-theme--header',
        headerName: 'Mobile No',
        flex: 1,
        minWidth: 170,
    },
    {
        field: 'total_request',
        headerClassName: 'super-app-theme--header',
        headerName: 'Total Bookings',
        flex: 1,
        minWidth: 170,
        renderCell: (params) =>(
            <div className="flex items-center h-full w-full px-2 justify-start">
              <div className="flex gap-3 items-center justify-center">
                <img src={BOOKING} alt="total bookings" className="w-7 h-7"></img>
                <span className="font-medium text-lg">{params.row?.issueStats?.total_issues || 0}</span>
              </div>
            </div>
        )
    },
    {
        field: 'resolved_request',
        headerClassName: 'super-app-theme--header',
        headerName: 'Completed Bookings',
        flex: 1,
        minWidth: 180,
        renderCell: (params) =>(
            <div className="flex items-center h-full w-full px-2 justify-start">
              <div className="flex gap-3 items-center justify-center">
                <img src={CHECKED} alt="total bookings" className="w-6 h-6"></img>
                <span className="font-medium text-lg">{params.row?.issueStats?.resolved_issues || 0}</span>
              </div>
            </div>
        )
    },
    {
        field: 'pending_request',
        headerClassName: 'super-app-theme--header',
        headerName: 'Pending Bookings',
        flex: 1,
        minWidth: 180,
        renderCell: (params) =>(
            <div className="flex items-center h-full w-full px-2 justify-start">
              <div className="flex gap-3 items-center justify-center">
                <img src={PENDING} alt="total bookings" className="w-7 h-7"></img>
                <span className="font-medium text-lg">{params.row?.issueStats?.pending_issues || 0}</span>
              </div>
            </div>
        )
    },
    {
        field: 'canceled_request',
        headerClassName: 'super-app-theme--header',
        headerName: 'Cancelled Bookings',
        flex: 1,
        minWidth: 180,
        renderCell: (params) =>(
            <div className="flex items-center h-full w-full px-2 justify-start">
              <div className="flex gap-3 items-center justify-center">
                <img src={CLOSE} alt="total bookings" className="w-6 h-6"></img>
                <span className="font-medium text-lg">{params.row?.issueStats?.canceled_issues || 0}</span>
              </div>
            </div>
        )
    },
    {
        field: 'createdAt',
        headerClassName: 'super-app-theme--header',
        headerName: 'Registered Date',
        flex: 1,
        minWidth: 150,
        renderCell: (params) =>(
            <span>{formatDate(params.value)}</span>
        )
    },
    {
        field: 'updatedAt',
        headerClassName: 'super-app-theme--header',
        headerName: 'Last Updated',
        flex: 1,
        minWidth: 150,
        renderCell: (params) =>(
            <span>{formatDate(params.value)}</span>
        )
    },
]

export const fetchUserData = async ()=>{
   try{
     const response = await api.get('user')
     console.log(response)
     return response.data.data
   }catch(err){
     throw err
   }
}