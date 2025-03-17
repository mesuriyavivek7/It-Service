import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/actions/authActions";
import { BiTrip } from "react-icons/bi";

//Importing components
import NotificationBar from "../NotificationBar";

//importing images
import LOGO from "../../assets/logo.png";
import PERSON from "../../assets/asset4.jpg";

import { useLocation , Outlet, useNavigate} from "react-router-dom";

//importing icons
import MenuIcon from "@mui/icons-material/Menu";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { ClipboardMinus } from 'lucide-react';
import { Beaker } from 'lucide-react';


export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isActive = (pathname) =>{
    return location.pathname.includes(pathname)
  }

  const getCurrentPageName = () =>{
    const arr = location.pathname.split('/')
    if(arr.length>=3){
      return arr[2].charAt(0).toUpperCase()+arr[2].slice(1)
    }else{
      return "Dashboard"
    }
  }

  const [openLeave,setOpenLeave] = useState(false)
  const [openPlan,setOpenPlan] = useState(false)

  const [isMenuOpen,setIsMenuOpen] = useState(true)
  const [isProfileOpen,setIsProfileOpen] = useState(false)

  const [notificationOpen,setNotificationOpen] = useState(false)

  const sidebarRef = useRef(null)

  const popupRef = useRef(null)

  const notificationRef = useRef(null)

  const handleNavigate = (pathname) =>{
    setIsMenuOpen(true)
    navigate(pathname)
 }

  // Handle click outside
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsProfileOpen(false)
    }

    if(notificationRef.current && !notificationRef.current.contains(event.target)){
     setNotificationOpen(false)
    }

    if(sidebarRef.current && !sidebarRef.current.contains(event.target)){
      setIsMenuOpen(true)
    }
  };

  const getName = (name) =>{
    if(!name) return "Unknown"
    return String(name).charAt(0).toUpperCase() + String(name).slice(1);
  }

  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoutUser = () =>{
     dispatch(logout())
     console.log("logout user")
     navigate('/')
  }

  return (
    <div className="flex h-screen bg-lightgray">
      {/* Navbar */}
      <div className="fixed bg-white z-40 top-0 right-0 left-0 md:h-24 h-20 flex items-center">
        <div className={`${isMenuOpen?"md:w-72":"md:w-28"} w-28 duration-300 transition-all px-5 h-full flex items-center gap-2`}>
          <img className="w-14 h-14" alt="logo" src={LOGO}></img>
          {isMenuOpen && <h1 className="text-themeblue md:block hidden text-3xl transition-all duration-300 font-semibold">Elvira</h1>}
        </div>
        <div className="flex justify-between px-2 md:px-8 h-full w-full items-center">
          <div className="flex items-center gap-3">
            <span onClick={()=>setIsMenuOpen(!isMenuOpen)} className="text-themeblue cursor-pointer">
              {isMenuOpen ? <MenuIcon style={{ fontSize: "2rem" }}></MenuIcon> : <ArrowRightAltIcon style={{fontSize: "2rem"}}></ArrowRightAltIcon>}
            </span>
            <span className="text-2xl md:block hidden font-bold">{getCurrentPageName()}</span>
          </div>
          
          <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 md:gap-8">
            <span onClick={()=>setNotificationOpen((prevData)=>!prevData)} className="bg-gray-100 text-themeblue cursor-pointer rounded-md flex justify-center items-center w-12 h-12">
              <NotificationsNoneOutlinedIcon
                style={{ fontSize: "1.8rem" }}
              ></NotificationsNoneOutlinedIcon>
            </span>
            <div onClick={()=>setIsProfileOpen(!isProfileOpen)} className="relative flex cursor-pointer items-center gap-3">
              <img
                className="w-12 h-12 rounded-full"
                src={PERSON}
                alt="profile"
              ></img>
              <div className="md:flex hidden flex-col">
                <h4 className="text-base leading-4 font-bold">{getName(user?.firstName)}</h4>
                <h4 className="text-sm">{user?.isAdmin?"Admin":"Member"}</h4>
              </div>
              {isProfileOpen && 
               <div ref={popupRef} className="absolute z-40 w-36 md:w-48 shadow rounded-md border bg-white top-[120%] right-0 flex flex-col ">
                 <Link to="/admin/profile"><div className="flex hover:bg-lightgray p-2 items-center gap-2 text-gray-500"><span className="text-blue-500"><AccountCircleIcon></AccountCircleIcon></span> Profile</div></Link>
                 <div onClick={logoutUser} className="flex hover:bg-lightgray p-2 items-center gap-2 text-gray-500"><span className="text-red-500"><LogoutIcon></LogoutIcon></span> Logout</div>
              </div>
              }
            </div>
          </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="w-full relative flex md:mt-24 mt-20">
        {/* Sidebar For Web screen */}
        <div className={`${isMenuOpen?"w-72":"w-28"} z-40 md:block overflow-scroll hidden transition-all duration-300 shadow-lg bg-white`}>
            <div onClick={()=>handleNavigate('/admin/dashboard')} className={`group flex ${isActive("dashboard") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('dashboard') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><DashboardOutlinedIcon style={{fontSize:'1.5rem'}}></DashboardOutlinedIcon></span>
               {isMenuOpen && <span className={`${isActive("dashboard") && "text-themeblue"} group-hover:text-themeblue font-medium text-lg`}>Dashboard</span>}
            </div>
            <div onClick={()=>handleNavigate('doctors')} className={`group flex ${isActive("doctors") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('doctors') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><LocalHospitalOutlinedIcon style={{fontSize:'1.5rem'}}></LocalHospitalOutlinedIcon></span>
               {isMenuOpen && <span className={`${isActive("doctors") && "text-themeblue"} group-hover:text-themeblue font-medium text-lg`}>Doctors</span>}
            </div>
            <div onClick={()=>handleNavigate('chemists')} className={`group flex ${isActive("chemists") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('chemists') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><ScienceOutlinedIcon style={{fontSize:'1.5rem'}}></ScienceOutlinedIcon></span>
               {isMenuOpen && <span className={`${isActive("chemists") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Chemists</span>}
            </div>
            <div onClick={()=>handleNavigate('employee')} className={`group flex ${isActive("employee") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('employee') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><PersonOutlineIcon style={{fontSize:'1.5rem'}}></PersonOutlineIcon></span>
               {isMenuOpen && <span className={`${isActive("employee") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Employee</span>}
            </div>
            <div onClick={()=>handleNavigate('myteam')} className={`group flex ${isActive("myteam") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('myteam') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><GroupOutlinedIcon style={{fontSize:'1.5rem'}}></GroupOutlinedIcon></span>
               {isMenuOpen && <span className={`${isActive("myteam") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>My Team</span>}
            </div>

            <div className="relative">
              <div onClick={()=>setOpenLeave((prev)=>!prev)} className={`group flex ${isActive("leaves") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 justify-between`}>
               <div className="flex items-center gap-2">
                 <span className={`${isActive('leaves') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><ExitToAppIcon style={{fontSize:'1.5rem'}}></ExitToAppIcon></span>
                 {isMenuOpen && <span className={`${isActive("leaves") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Leaves</span>}
               </div>
               {isMenuOpen && <span className="text-gray-700">{openLeave?<KeyboardArrowDownIcon></KeyboardArrowDownIcon>:<ChevronRightIcon></ChevronRightIcon>}</span>}
              </div>
              <div className={`px-2 flex flex-col ${openLeave?"h-20":"h-0"} transition-all duration-300 overflow-hidden`}>            
               <div onClick={()=>handleNavigate('myleaves')} className={`group flex ${isActive("myleaves") && "text-blue-600"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                 <span className={`${isActive('myleaves') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                 {isMenuOpen && <span className={`${isActive("myleaves") && "text-themeblue"} group-hover:text-themeblue font-medium`}>My Leaves</span>}
              </div>
              <div onClick={()=>handleNavigate('pendingleaves')} className={`group flex ${isActive("pendingleaves") && "text-blue-600"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                <span className={`${isActive('pendingleaves') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                {isMenuOpen && <span className={`${isActive("pendingleaves") && "text-themeblue"} group-hover:text-themeblue font-medium`}>Pending On Me</span>}
               </div>
              </div>
            </div>

            <div className="relative">
              <div onClick={()=>setOpenPlan((prev)=>!prev)} className={`group flex ${isActive("plan") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 justify-between`}>
               <div className="flex items-center gap-2">
                 <span className={`${isActive('plan') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><BiTrip style={{fontSize:'1.5rem'}}></BiTrip></span>
                 {isMenuOpen && <span className={`${isActive("plan") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Tour Plans</span>}
               </div>
               {isMenuOpen && <span className="text-gray-700">{openPlan?<KeyboardArrowDownIcon></KeyboardArrowDownIcon>:<ChevronRightIcon></ChevronRightIcon>}</span>}
              </div>
              <div className={`px-2 flex flex-col ${openPlan?"h-40":"h-0"} transition-all duration-300 overflow-hidden`}>            
                <div onClick={()=>handleNavigate('stpplan')} className={`group flex ${isActive("stpplan") && "text-blue-600"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                  <span className={`${isActive('stpplan') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                  {isMenuOpen && <span className={`${isActive("stpplan") && "text-themeblue"} group-hover:text-themeblue font-medium`}>STP Plan</span>}
                </div>
                <div onClick={()=>handleNavigate('mtpplan')} className={`group flex ${isActive("mtpplan") && "text-blue-600"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                 <span className={`${isActive('mtpplan') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                 {isMenuOpen && <span className={`${isActive("mtpplan") && "text-themeblue"} group-hover:text-themeblue font-medium`}>MTP Plan</span>}
                </div>
                <div onClick={()=>handleNavigate('pendingstp')} className={`group flex ${isActive("pendingstp") && "text-blue-600"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                  <span className={`${isActive('pendingstp') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                  {isMenuOpen && <span className={`${isActive("pendingstp") && "text-themeblue"} group-hover:text-themeblue font-medium`}>Pending STP</span>}
                </div>
                <div onClick={()=>handleNavigate('pendingmtp')} className={`group flex ${isActive("pendingmtp") && "text-blue-600"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                  <span className={`${isActive('pendingmtp') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                  {isMenuOpen && <span className={`${isActive("pendingmtp") && "text-themeblue"} group-hover:text-themeblue font-medium`}>Pending MTP</span>}
                </div>
              </div>
            </div>

            <div onClick={()=>handleNavigate('chemistmapping')} className={`group flex ${isActive("chemistmapping") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('chemistmapping') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><Beaker className="w-5 h-5"></Beaker></span>
               {isMenuOpen && <span className={`${isActive("chemistmapping") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Chemist Mapping</span>}
            </div>

            <div onClick={()=>handleNavigate('doctormapping')} className={`group flex ${isActive("doctormapping") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('doctormapping') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><ClipboardMinus className="w-5 h-5"></ClipboardMinus></span>
               {isMenuOpen && <span className={`${isActive("doctormapping") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Doctor Mapping</span>}
            </div>

 
 

        </div>
        {/* sidebar for mobile screen */}
        <div ref={sidebarRef} className={`${isMenuOpen?"-left-96":"left-0"} z-40 w-64 bottom-0 top-0 md:hidden absolute overflow-scroll transition-all duration-300 shadow-lg bg-white`}>
            <div onClick={()=>handleNavigate('/admin')} className={`group flex ${isActive("dashboard") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('dashboard') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><DashboardOutlinedIcon style={{fontSize:'1.5rem'}}></DashboardOutlinedIcon></span>
               <span className={`${isActive("dashboard") && "text-themeblue"} group-hover:text-themeblue font-medium text-lg`}>Dashboard</span>
            </div>
            <div onClick={()=>handleNavigate('doctors')} className={`group flex ${isActive("doctors") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('doctors') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><LocalHospitalOutlinedIcon style={{fontSize:'1.5rem'}}></LocalHospitalOutlinedIcon></span>
               <span className={`${isActive("doctors") && "text-themeblue"} group-hover:text-themeblue font-medium text-lg`}>Doctors</span>
            </div>
            <div onClick={()=>handleNavigate('chemists')} className={`group flex ${isActive("chemists") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('chemists') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><ScienceOutlinedIcon style={{fontSize:'1.5rem'}}></ScienceOutlinedIcon></span>
               <span className={`${isActive("chemists") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Chemists</span>
            </div>
            <div onClick={()=>handleNavigate('employee')} className={`group flex ${isActive("employee") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('employee') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><PersonOutlineIcon style={{fontSize:'1.5rem'}}></PersonOutlineIcon></span>
               <span className={`${isActive("employee") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Employee</span>
            </div>

            <div className="relative">
              <div onClick={()=>setOpenLeave((prev)=>!prev)} className={`group flex ${isActive("leaves") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 justify-between`}>
                <div className="flex items-center gap-2">
                 <span className={`${isActive('myleaves') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><ExitToAppIcon style={{fontSize:'1.5rem'}}></ExitToAppIcon></span>
                 <span className={`${isActive("myleaves") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Leaves</span>
                </div>
                 <span className="text-gray-700">{openLeave?<KeyboardArrowDownIcon></KeyboardArrowDownIcon>:<ChevronRightIcon></ChevronRightIcon>}</span>
              </div>
              <div className={`flex flex-col ${openLeave?"h-20":"h-0"} px-2 transition-all duration-300 overflow-hidden`}>
                <div onClick={()=>handleNavigate('myleaves')} className={`group flex ${isActive("myleaves") && "text-themeblue"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                  <span className={`${isActive('myleaves') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                  <span className={`${isActive("myleaves") && "text-themeblue"} group-hover:text-themeblue font-medium`}>My Leaves</span>
                </div>
                <div onClick={()=>handleNavigate('pendingleaves')} className={`group flex ${isActive("pendingleaves") && "text-themeblue"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                  <span className={`${isActive('pendingleaves') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                  <span className={`${isActive("pendingleaves") && "text-themeblue"} group-hover:text-themeblue font-medium`}>Pending On Me</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div onClick={()=>setOpenPlan((prev)=>!prev)} className={`group flex ${isActive("plan") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 justify-between`}>
                <div className="flex items-center gap-2">
                 <span className={`${isActive('myleaves') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><BiTrip style={{fontSize:'1.5rem'}}></BiTrip></span>
                 <span className={`${isActive("myleaves") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Tour Plans</span>
                </div>
                 <span className="text-gray-700">{openPlan?<KeyboardArrowDownIcon></KeyboardArrowDownIcon>:<ChevronRightIcon></ChevronRightIcon>}</span>
              </div>
              <div className={`flex flex-col ${openPlan?"h-40":"h-0"} px-2 transition-all duration-300 overflow-hidden`}>
                <div onClick={()=>handleNavigate('stpplan')} className={`group flex ${isActive("stpplan") && "text-themeblue"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                  <span className={`${isActive('stpplan') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                  <span className={`${isActive("stpplan") && "text-themeblue"} group-hover:text-themeblue font-medium `}>STP Plan</span>
                </div>
                <div onClick={()=>handleNavigate('mtpplan')} className={`group flex ${isActive("mtpplan") && "text-themeblue"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                  <span className={`${isActive('mtpplan') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                  <span className={`${isActive("mtpplan") && "text-themeblue"} group-hover:text-themeblue font-medium`}>MTP Plan</span>
                </div>
                <div onClick={()=>handleNavigate('pendingstp')} className={`group flex ${isActive("pendingstp") && "text-themeblue"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                  <span className={`${isActive('pendingstp') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                  <span className={`${isActive("pendingstp") && "text-themeblue"} group-hover:text-themeblue font-medium`}>Pending STP</span>
                </div>
                <div onClick={()=>handleNavigate('pendingmtp')} className={`group flex ${isActive("pendingmtp") && "text-themeblue"} hover:bg-blue-50 py-2 cursor-pointer px-8 items-center gap-2`}>
                  <span className={`${isActive('pendingmtp') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><HorizontalRuleIcon style={{fontSize:'1.5rem'}}></HorizontalRuleIcon></span>
                  <span className={`${isActive("pendingmtp") && "text-themeblue"} group-hover:text-themeblue font-medium`}>Pending MTP</span>
                </div>
              </div>
            </div>

            <div onClick={()=>handleNavigate('chemistmapping')} className={`group flex ${isActive("chemistmapping") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('chemistmapping') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><Beaker className="w-5 h-5"></Beaker></span>
               <span className={`${isActive("chemistmapping") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Chemist Mapping</span>
            </div>

            <div onClick={()=>handleNavigate('doctormapping')} className={`group flex ${isActive("doctormapping") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('doctormapping') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><ClipboardMinus className="w-5 h-5"></ClipboardMinus></span>
               <span className={`${isActive("doctormapping") && "text-themeblue"} group-hover:text-themeblue font-medium  text-lg`}>Doctor Mapping</span>
            </div>

            

        </div>
          <NotificationBar ref={notificationRef} notificationOpen={notificationOpen}></NotificationBar>
        {/* Outlate */}
        <div className="w-full md:px-6 px-4 py-2 md:py-4 overflow-y-auto ">
            <Outlet></Outlet>
        </div>
      </div>

    </div>
  );
}
