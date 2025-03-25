import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

//Importing components

//importing images
import PERSON from '../assets/asset4.jpg'
import LOGO from '../assets/security.png'


import { useLocation , Outlet, useNavigate} from "react-router-dom";

//importing icons
import MenuIcon from "@mui/icons-material/Menu";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

import api from "../api";
import { toast } from "react-toastify";



export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [userDetails,setUserDetails] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchUserDetails = async () =>{
       try{
        const response = await api.get(`/admin`)
        console.log(response)
        setUserDetails(response.data.data)
       }catch(err){
        console.log(err)
        toast.error(err?.response?.data?.message || "Something went wrong.")
       }
    }

    fetchUserDetails()
  },[])

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

  const [isMenuOpen,setIsMenuOpen] = useState(true)
  const [isProfileOpen,setIsProfileOpen] = useState(false)

  const sidebarRef = useRef(null)

  const popupRef = useRef(null)


  const handleNavigate = (pathname) =>{
    setIsMenuOpen(true)
    navigate(pathname)
 }

  // Handle click outside
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsProfileOpen(false)
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
     console.log("logout user")
     navigate('/')
  }

  return (
    <div className="flex w-screen overflow-hidden h-screen bg-white">

      {/* Sidebar For Web screen */}
      <div className={`${isMenuOpen?"w-[16%]":"w-[6%]"} bg-themecolor z-40 md:block hidden transition-all duration-300 shadow-lg`}>
            <div className="flex h-20 border-bordercolor border-b items-center justify-center">
              <div className="flex items-center gap-3">
                <img className="w-8 h-8" alt="logo" src={LOGO}></img>
                {isMenuOpen && <h1 className="text-themeblue md:block hidden text-white text-2xl transition-all duration-300 font-semibold">IT Service</h1>}
              </div>
            </div>
            <div className="flex flex-col gap-2 overflow-scroll">
             <div className="px-6 py-4">
               <span className="text-xs text-navtext">MAIN</span>
             </div>
             <div onClick={()=>handleNavigate('/admin/dashboard')} className={`group transition-all duration-300 flex hover:text py-3 px-6 cursor-pointer items-center gap-2`}>
                <span className={`${isActive('dashboard') ? "text-white" : "text-navtext group-hover:text-white"} transition-all duration-300`}><DashboardOutlinedIcon style={{fontSize:'1.5rem'}}></DashboardOutlinedIcon></span>
                {isMenuOpen && <span className={`${isActive("dashboard") ? "text-white" : "text-navtext"} group-hover:text-white text-base transition-all duration-300`}>Dashboard</span>}
             </div>
             <div onClick={()=>handleNavigate('/admin/users')} className={`group flex hover:text py-3 px-6 cursor-pointer items-center gap-2`}>
                <span className={`${isActive('users') ? "text-white" : "text-navtext"} group-hover:text-white transition-all duration-300`}><PeopleOutlinedIcon style={{fontSize:'1.5rem'}}></PeopleOutlinedIcon></span>
                {isMenuOpen && <span className={`${isActive("users") ? "text-white" : "text-navtext"} group-hover:text-white text-base transition-all duration-300`}>Users</span>}
             </div>
             <div onClick={()=>handleNavigate('/admin/employee')} className={`group flex hover:text py-3 px-6 cursor-pointer items-center gap-2`}>
                <span className={`${isActive('employee') ? "text-white" : "text-navtext"} group-hover:text-white transition-all duration-300`}><PermIdentityOutlinedIcon style={{fontSize:'1.5rem'}}></PermIdentityOutlinedIcon></span>
                {isMenuOpen && <span className={`${isActive("employee") ? "text-white" : "text-navtext"} group-hover:text-white text-base transition-all duration-300`}>Employee</span>}
             </div>
             <div onClick={()=>handleNavigate('/admin/booking')} className={`group flex hover:text py-3 px-6 cursor-pointer items-center gap-2`}>
                <span className={`${isActive('booking') ? "text-white" : "text-navtext"} group-hover:text-white transition-all duration-300`}><CheckBoxOutlinedIcon style={{fontSize:'1.5rem'}}></CheckBoxOutlinedIcon></span>
                {isMenuOpen && <span className={`${isActive("booking") ? "text-white" : "text-navtext"} group-hover:text-white text-base transition-all duration-300`}>Bookings</span>}
             </div>
            </div>
      </div>

      {/* sidebar for mobile screen */}
        <div ref={sidebarRef} className={`${isMenuOpen?"-left-64":"left-0"} bg-themecolor z-40 w-64 bottom-0 top-0 md:hidden absolute overflow-scroll transition-all duration-300 shadow-lg`}>
          <div className="flex h-20 border-bordercolor border-b items-center justify-center">
            <div className="flex items-center gap-2">
              <img className="w-8 h-8" alt="logo" src={LOGO}></img>
              <h1 className="text-themeblue text-white text-2xl transition-all duration-300 font-semibold">Duet</h1>
            </div>
          </div>
          <div className="flex flex-col gap-2 overflow-scroll">
             <div className="px-6 py-2">
               <span className="text-xs text-navtext">MAIN</span>
             </div>
            <div onClick={()=>handleNavigate('/admin/dashboard')} className={`group flex hover:text-navtext py-2 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('dashboard') ? "text-white" : "text-navtext group-hover:text-white"} transition-all duration-300 `}><DashboardOutlinedIcon style={{fontSize:'1.2rem'}}></DashboardOutlinedIcon></span>
               <span className={`${isActive("dashboard") ? "text-white" : "text-navtext"} group-hover:text-white font-medium text-base`}>Dashboard</span>
            </div>
            <div onClick={()=>handleNavigate('/admin/users')} className={`group flex hover:text-navtext py-2 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('users') ? "text-white" : "text-navtext group-hover:text-white"} transition-all duration-300 `}><PeopleOutlinedIcon style={{fontSize:'1.2rem'}}></PeopleOutlinedIcon></span>
               <span className={`${isActive("users") ? "text-white" : "text-navtext"} group-hover:text-white font-medium text-base`}>Users</span>
            </div>
            <div onClick={()=>handleNavigate('/admin/employee')} className={`group flex hover:text-navtext py-2 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('employee') ? "text-white" : "text-navtext group-hover:text-white"} transition-all duration-300 `}><PermIdentityOutlinedIcon style={{fontSize:'1.2rem'}}></PermIdentityOutlinedIcon></span>
               <span className={`${isActive("employee") ? "text-white" : "text-navtext"} group-hover:text-white font-medium text-base`}>Employee</span>
            </div>
            <div onClick={()=>handleNavigate('/admin/booking')} className={`group flex hover:text-navtext py-2 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('booking') ? "text-white" : "text-navtext group-hover:text-white"} transition-all duration-300 `}><CheckBoxOutlinedIcon style={{fontSize:'1.2rem'}}></CheckBoxOutlinedIcon></span>
               <span className={`${isActive("booking") ? "text-white" : "text-navtext"} group-hover:text-white font-medium text-base`}>Bookings</span>
            </div>
          </div>
        </div>

      {/* Main content */}
      <div className={`${isMenuOpen?"md:left-[16%] left-0":"md:left-[6%] left-0"} transition-all duration-300 top-0 right-0 bottom-0 h-full fixed flex flex-col`}>

      {/* Navbar */}
        <div className="flex bg-white z-40 md:h-22 border-b-shadow shadow h-16 justify-between px-4 md:px-8 w-full items-center">

          <div className="flex items-center gap-4">
            <span onClick={()=>setIsMenuOpen(!isMenuOpen)} className=" font-light cursor-pointer">
              {isMenuOpen ? <MenuIcon style={{ fontSize: "2rem" }}></MenuIcon> : <ArrowRightAltIcon style={{fontSize: "2rem"}}></ArrowRightAltIcon>}
            </span>
            <span className="text-2xl md:block hidden font-bold">{getCurrentPageName()}</span>
          </div>
        

          <div className="flex items-center gap-4 md:gap-8">
            <div onClick={()=>setIsProfileOpen(!isProfileOpen)} className="relative flex cursor-pointer items-center gap-3">
              <img
                className="md:w-12 md:h-12 h-10 w-10 rounded-full"
                src={PERSON}
                alt="profile"
              ></img>

              <div className="md:flex hidden flex-col">
                <h4 className="text-base leading-4 font-bold">{getName(userDetails?.name)}</h4>
                <h4 className="text-sm">{getName(user?.userType)}</h4>
              </div>

              {isProfileOpen && 
               <div ref={popupRef} className="absolute z-40 w-30 md:w-40 shadow-md rounded-md bg-white top-[140%] right-0 flex flex-col ">
                 <Link to="/admin/profile"><div className="flex hover:bg-lightgray p-2 items-center gap-2 text-gray-500"><span className="text-blue-500"><AccountCircleIcon></AccountCircleIcon></span> Profile</div></Link>
                 <div onClick={logoutUser} className="flex hover:bg-lightgray p-2 items-center gap-2 text-gray-500"><span className="text-red-500"><LogoutIcon></LogoutIcon></span> Logout</div>
              </div>
              }
            </div>
          </div>

      </div>

       {/* Outlate */}
        <div className="w-full h-full bg-outlinebg p-4 overflow-y-auto ">
            <Outlet></Outlet>
        </div>

      </div>

    </div>
  );
}




