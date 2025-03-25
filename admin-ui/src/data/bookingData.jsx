import api from "../api";
import Tooltip from "@mui/material/Tooltip";

//Importing images



const formatDate= (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    return `${day}, ${month} ${year}`;
}


export const bookingColumns = [

]


export const fetchBookingData = async () =>{
    try{
       const response = await api.get('/issue')
       console.log(response)
       return response.data.data
    }catch(err){
        throw err
    }
}