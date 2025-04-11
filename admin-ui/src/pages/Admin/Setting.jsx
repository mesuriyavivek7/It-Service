import React, { useEffect, useState } from "react";

import {toast} from 'react-toastify'

//Importing icons
import { AppleIcon, Eye, TableRowsSplit, Trophy } from 'lucide-react';
import { EyeOff } from "lucide-react";
import api from "../../api";

function Setting() {

  const [TwilioData,setTwilioData] = useState({
    accountsid:'',
    authtoken:'',
    mobileno:''
  })

  const [showSid,setShowSid] = useState(false)
  const [showToken,setShowToken] = useState(false)

  useEffect(()=>{
    const fetchData = async ()=>{
       try{
        const response = await api.get('twilio')
        setTwilioData(response.data.data)
       }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
       }
    }

    fetchData()
  },[])


  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <div className="bg-white items-center flex justify-between rounded-md p-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
        <h1 className="text-black text-lg font-medium">App Configuration</h1>
      </div>
      <div className="bg-white shadow-sm rounded-md flex p-4 flex-col gap-4">
        <h1 className="font-medium">Twilio Configuration</h1>
        <div className="grid grid-cols-3 gap-4">
           <div className="flex relative flex-col gap-1">
             <label className="text-neutral-600">Account SID</label>
             <input className="border rounded-md border-neutral-200 p-2 outline-none" readOnly type={showSid?"text":"password"} value={TwilioData?.accountsid}></input>
             <div onClick={()=>setShowSid((prev)=>!prev)} className="absolute cursor-pointer right-2 top-10">{showSid?<EyeOff className="w-5 h-5"></EyeOff>:<Eye className="w-5 h-5"></Eye>}</div>
           </div>
           <div className="flex relative flex-col gap-1">
             <label className="text-neutral-600">Auth Token</label>
             <input className="border rounded-md border-neutral-200 p-2 outline-none" readOnly type={showToken?"text":"password"} value={TwilioData?.authtoken}></input>
             <div onClick={()=>setShowToken((prev)=>!prev)} className="absolute cursor-pointer right-2 top-10">{showToken?<EyeOff className="w-5 h-5"></EyeOff>:<Eye className="w-5 h-5"></Eye>}</div>
           </div>
           <div className="flex flex-col gap-1">
             <label className="text-neutral-600">Mobile Number</label>
             <input className="border rounded-md border-neutral-200 p-2 outline-none" readOnly type="text" value={TwilioData?.mobileno}></input>
           </div>
          
        </div>
      </div>
    </div>
  );
}

export default Setting;
