import React from 'react'
import Navbar from './components/Navbar'

import {Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/HomePage.jsx'
import Login from './pages/LoginPage.jsx'
import Signup from './pages/SignupPage.jsx'
import Profile from './pages/ProfilePage.jsx'
import Settings from './pages/SettingsPage.jsx'
import { axiosInstance } from './lib/axios'
import { use } from 'react'
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

function App() {
  
  // get authUser and checkAuth from useAuthStore
  const { authUser, checkAuth, isCheckingAuth , onlineUsers} = useAuthStore();
  // console.log("authuser"); console.log(authUser);
 
  useEffect(() => {
    checkAuth();  
  }, [checkAuth]);



  // if auth is being checked and no authUser, show loading spinner
 if(isCheckingAuth && !authUser){
  return (<div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}> 
   <span className="loading loading-spinner loading-xl"></span>
   </div>
 )}

  return (
<div>
  <Navbar/>
  <Routes>
    <Route path="/" element={authUser ? <Home/> : <Navigate to="/login"/>}/>
    <Route path="/login" element={authUser ? <Navigate to="/"/> : <Login/>}/>
    <Route path="/signup" element={authUser ? <Navigate to="/"/> :  <Signup/>}/>
    <Route path="/profile" element={authUser ? <Profile/> : <Navigate to="/login" />}/>
    <Route path="/settings" element={authUser ? <Settings/> : <Navigate to="/login" />}/>
  </Routes>
  <Toaster/>
</div>
  )
}

export default App