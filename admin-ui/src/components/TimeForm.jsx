import { useEffect, useState } from "react";
import React from "react";

//Importing icons
import { LoaderCircle, Plus, X } from 'lucide-react';
import { toast } from "react-toastify";
import api from "../api";



const parse12HourTime = (timeStr) =>{
  const match = timeStr.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);

  if (!match) {
    throw new Error('Invalid time format. Use hh:mmAM or hh:mmPM');
  }

  const hour = match[1].padStart(2, '0');
  const minute = match[2];
  const ampm = match[3].toUpperCase();

  return { hour, minute, ampm };
}


function TimeForm({handleCloseModal,time}) {

  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmPm] = useState("AM");
  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    if(time){
      const {hour,minute,ampm} = parse12HourTime(time.time)
      setHour(hour)
      setMinute(minute)
      setAmPm(ampm)
    }
  },[time])

  const handleAddTime = async () =>{
    setLoading(true)
    try{
       const response = await api.post('time',{time:`${hour}:${minute}${ampm}`})
       handleCloseModal()
       toast.success("New time added successfully.")
    }catch(err){
      console.log(err)
      toast.error(err?.response?.data?.message || "Something went wrong.")
    }finally{
      setLoading(false)
    }
  }

  const handleChangeTime = async () =>{
     setLoading(true)
     try{
       const response = await api.put(`time/${time._id}`,{time:`${hour}:${minute}${ampm}`})
       handleCloseModal()
       toast.success("Time changed successfully.")
     }catch(err){
       console.log(err)
       toast.error(err?.response?.data?.message || "Something went wrong.")
     }finally{
      setLoading(false)
     }
  }

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 bg-opacity-50">
      <div className="rounded-md bg-white flex flex-col gap-4 p-4 w-96">
        <div className="flex justify-between items-center">
           <h1 className="text-lg font-semibold">Add Time Slot</h1>
           <X onClick={handleCloseModal} className="text-red-500 w-6 h-6 cursor-pointer hover:text-red-600 transition-all duration-300"></X>
        </div>
        <div className="flex items-center gap-2 py-2">
          {/* Hour */}
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="border p-2 rounded"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const h = String(i + 1).padStart(2, "0");
              return (
                <option key={h} value={h}>
                  {h}
                </option>
              );
            })}
          </select>

          {/* Minute */}
          <select
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="border p-2 rounded"
          >
            {["00", "15", "30", "45"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* AM/PM */}
          <select
            value={ampm}
            onChange={(e) => setAmPm(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
          <button
            onClick={time?handleChangeTime:handleAddTime}
            className="ml-2 flex justify-center items-center cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
          >
             {
              loading ?
               (<LoaderCircle className="animate-spin"></LoaderCircle>):
               (!time? 
               <div className="flex items-center gap-2"><Plus></Plus> <span>Add</span></div>:
               <span>Save</span>) 
             }
          </button>
        </div>

      </div>
    </div>
  );
}

export default TimeForm;
