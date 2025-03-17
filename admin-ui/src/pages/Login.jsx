import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

//Importing icons
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';

const Login = () => {
  const [formData,setFormData] = useState({
    email:'',
    password:''
  })

  const [errors,setErrors] = useState({})
  const [loading,setLoading] = useState(false)

  const [showPassword,setShowPassword] = useState(false)

  const validateData = () =>{
     let newErrors = {}
     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

     if(!formData.email) newErrors.email="Email address is required."
     else if(emailRegex.test(formData.email)) newErrors.email='Invalid email address.'
     if(formData.password) newErrors.password="Password is required."
     
     setErrors(newErrors)

     return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) =>{
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const {name,value} = e.target

      if(name==="email" && !value) setErrors((prevData)=>({...prevData,[name]:"Email address is required."}))
      else if(name==="email" && !emailRegex.test(value)) setErrors((prevData)=>({...prevData,[name]:"Invlaid email address."}))
      else{
        const {email,...other} = errors
        setErrors(other)
      }

      if(name==="password" && !value) setErrors((prevData)=>({...prevData,[name]:"Password is required."}))

      setFormData((prevData)=>({...prevData,[name]:value}))
  } 

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-900 p-3 rounded-xl">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-white"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </div>
          
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-gray-600 mt-2">Please enter your credentials to sign in!</p>
          </div>
          
          {/* Login Form */}
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                placeholder='admin@example.com'
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword?"text":"password"}
                  onChange={handleChange}
                  value={formData.password}
                  placeholder='*****'
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  onClick={()=>setShowPassword((prev)=>!prev)}
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 text-gray-500 flex items-center"
                >
                  {showPassword?<EyeOff className='w-5 h-5'></EyeOff>:<Eye className='w-5 h-5'></Eye>}
                </button>
              </div>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot password
              </a>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Tech Support: (555) 123-4567</p>
            <p className="mt-1">Hours: 24/7 for Hardware Emergencies</p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Interactive Background */}
      <div className="hidden md:block md:w-1/2 bg-blue-500 relative overflow-hidden">
        {/* Blue wave background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600">
          <svg className="absolute bottom-0 left-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="rgba(255,255,255,0.1)" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg className="absolute top-0 right-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="rgba(255,255,255,0.1)" fillOpacity="1" d="M0,96L48,128C96,160,192,224,288,213.3C384,203,480,117,576,101.3C672,85,768,139,864,160C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
        
        {/* Animated Hardware Icons */}
        <div className="relative h-full w-full">
          {/* Laptop */}
          <motion.div 
            className="absolute top-10 right-20" 
            initial={{ x: "10%", y: "20%", opacity: 0 }}
            animate={{ 
              x: "10%", 
              y: "20%", 
              opacity: 1,
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{ 
              opacity: { duration: 1 },
              rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="2" y1="20" x2="22" y2="20"></line>
            </svg>
          </motion.div>
          
          {/* Desktop PC */}
          <motion.div 
            className="absolute top-20 left-10" 
            initial={{ x: "60%", y: "30%", opacity: 0 }}
            animate={{ 
              x: "60%", 
              y: "30%", 
              opacity: 1,
              rotate: [0, -3, 0, 3, 0],
            }}
            transition={{ 
              opacity: { duration: 1, delay: 0.3 },
              rotate: { repeat: Infinity, duration: 7, ease: "easeInOut" }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12" y2="18"></line>
            </svg>
          </motion.div>
          
          {/* CPU */}
          <motion.div 
            className="absolute  top-[60%] right-1/4" 
            initial={{ x: "35%", y: "65%", opacity: 0 }}
            animate={{ 
              x: "35%", 
              y: "65%", 
              opacity: 1,
              scale: [1, 1.05, 1, 0.95, 1],
            }}
            transition={{ 
              opacity: { duration: 1, delay: 0.6 },
              scale: { repeat: Infinity, duration: 5, ease: "easeInOut" }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="1" x2="9" y2="4"></line>
              <line x1="15" y1="1" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="23"></line>
              <line x1="15" y1="20" x2="15" y2="23"></line>
              <line x1="20" y1="9" x2="23" y2="9"></line>
              <line x1="20" y1="14" x2="23" y2="14"></line>
              <line x1="1" y1="9" x2="4" y2="9"></line>
              <line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>
          </motion.div>
          
          {/* Server */}
          <motion.div 
            className="absolute left-1/6 top-1/2" 
            initial={{ x: "75%", y: "70%", opacity: 0 }}
            animate={{ 
              x: "75%", 
              opacity: 1,
              y: ["70%", "72%", "70%", "68%", "70%"],
            }}
            transition={{ 
              opacity: { duration: 1, delay: 0.9 },
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6" y2="6"></line>
              <line x1="6" y1="18" x2="6" y2="18"></line>
            </svg>
          </motion.div>
          
          {/* Router */}
          <motion.div 
            className=" absolute top-1/4 right-1/2" 
            initial={{ x: "18%", y: "45%", opacity: 0 }}
            animate={{ 
              x: "18%", 
              y: "45%", 
              opacity: 1,
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{ 
              opacity: { duration: 1, delay: 1.2 },
              rotate: { repeat: Infinity, duration: 5, ease: "easeInOut" }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="6" y1="12" x2="10" y2="12"></line>
              <line x1="14" y1="12" x2="18" y2="12"></line>
            </svg>
          </motion.div>
          
          {/* Floating circuit lines */}
          <motion.div 
            className="absolute inset-0" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M10,30 L40,30 L40,70 L70,70 L70,50 L90,50" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M20,20 L50,20 L50,60 L80,60 L80,40 L95,40" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M15,80 L45,80 L45,40 L75,40 L75,60 L95,60" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>
          </motion.div>
        </div>
        
        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h2 className="text-2xl font-bold">Hardware Service Management</h2>
          <p className="mt-2 opacity-80">Manage your enterprise hardware infrastructure efficiently</p>
        </div>
      </div>
    </div>
  );
};

export default Login