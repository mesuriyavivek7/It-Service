import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { loginFailure, loginSuccess } from './redux/action/authAction';
import api from './api';

//Importing General Components
import Login from './pages/Login';

//Importing Amdin components
import AdminDashboard from './components/AdminDashboard';
import MainAdmin from './pages/Admin/MainAdmin';
import User from './pages/Admin/User';
import Employee from './pages/Admin/Employee';
import Booking from './pages/Admin/Booking';
import PreviewBooking from './pages/Admin/PreviewBooking';


const ProtectedRoute = ({children, requiredRole}) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) {
    console.log(user)
    return <Navigate to="/" />;
  }

  if(requiredRole && user?.userType !== requiredRole){
    return <Navigate to={`/${user.userType}`}></Navigate>
  }

  return children;
};


function App() {
  const {user} = useSelector((state)=>state.auth)
  console.log(user)
  const dispatch = useDispatch()

  //Validate user
  useEffect(()=>{
     const validateUser = async ()=>{
        try{
           const response = await api.get('/auth/validateuser')
           console.log(response)
           dispatch(loginSuccess(response.data.data))
        }catch(err){
          console.log(err)
          dispatch(loginFailure("User validation failed."))
        }
     }
     validateUser()
  },[])

  return (
    <Router>
      <Routes>

         {/* General Routes */}
         <Route path='/' element={!user?
         <Login></Login>:
         <Navigate to={`${user?.userType}/dashboard`}></Navigate>
         }></Route>

        {/* Admin Routes */}
         <Route path='admin' element={<ProtectedRoute requiredRole="admin"><AdminDashboard></AdminDashboard></ProtectedRoute>}>
           <Route path='dashboard' element={<MainAdmin></MainAdmin>}></Route>
           <Route path='users' element={<User></User>}></Route>
           <Route path='employee' element={<Employee></Employee>}></Route>
           <Route path='booking' element={<Booking></Booking>}>
            <Route path='preview' element={<PreviewBooking></PreviewBooking>}></Route>
           </Route>
         </Route>

      </Routes>
    </Router>
  )
}

export default App
