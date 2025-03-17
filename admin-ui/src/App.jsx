import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
         <Route path='/' element={<Login></Login>}></Route>
      </Routes>
    </Router>
  )
}

export default App
