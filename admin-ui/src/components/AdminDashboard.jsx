import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
      <div className={`${isMenuOpen?"w-[18%]":"w-[10%]"} bg-themecolor border z-40 md:block hidden transition-all duration-300 shadow-lg`}>
            <div className="flex h-20 border-bordercolor border-b items-center justify-center">
              <div className="flex items-center gap-3">
                <img className="w-8 h-8" alt="logo" src={LOGO}></img>
                {isMenuOpen && <h1 className="text-themeblue md:block hidden text-white text-2xl transition-all duration-300 font-semibold">Duet</h1>}
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
            </div>

      </div>

      {/* Main content */}
      <div className={`${isMenuOpen?"w-[84%]":"w-[90%]"} h-full w-[80%] relative border flex flex-col`}>

      {/* Navbar */}
        <div className="flex bg-white z-40 md:h-20 border h-16 justify-between px-2 md:px-8 w-full items-center">

          <div className="flex items-center gap-4">
            <span onClick={()=>setIsMenuOpen(!isMenuOpen)} className="text-themeblue cursor-pointer">
              {isMenuOpen ? <MenuIcon style={{ fontSize: "2rem" }}></MenuIcon> : <ArrowRightAltIcon style={{fontSize: "2rem"}}></ArrowRightAltIcon>}
            </span>
            <span className="text-2xl md:block hidden font-bold">{getCurrentPageName()}</span>
          </div>
        

          <div className="flex items-center gap-4 md:gap-8">
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

       {/* Outlate */}
        <div className="w-full h-full bg-outlinebg p-4 overflow-y-auto ">
            <Outlet></Outlet>
        </div>

      </div>

    </div>
  );
}




        {/* sidebar for mobile screen */}
        {/* <div ref={sidebarRef} className={`${isMenuOpen?"-left-96":"left-0"} z-40 w-64 bottom-0 top-0 md:hidden absolute overflow-scroll transition-all duration-300 shadow-lg bg-white`}>
            <div onClick={()=>handleNavigate('/admin')} className={`group flex ${isActive("dashboard") && "bg-blue-50 border-r-2 border-themeblue"} hover:bg-blue-50 py-4 cursor-pointer px-8 items-center gap-2`}>
               <span className={`${isActive('dashboard') ? "text-themeblue" : "text-gray-700 group-hover:text-themeblue"} `}><DashboardOutlinedIcon style={{fontSize:'1.5rem'}}></DashboardOutlinedIcon></span>
               <span className={`${isActive("dashboard") && "text-themeblue"} group-hover:text-themeblue font-medium text-lg`}>Dashboard</span>
            </div>
        </div> */}