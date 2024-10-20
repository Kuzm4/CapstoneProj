import { useState } from 'react'
import './App.css'
import _adminlogin from './components/adminlogin/adminlogin'
import _admindashboard from './components/admindashboard/admindashboard'

import {
  createBrowserRouter,
  RouterProvider, Link
} from 'react-router-dom'

const router = createBrowserRouter ([
  {
    path: '/',
    element: <div><_adminlogin/></div> 
  },
  {
    path: '/admindashboard',
    element: <div><_admindashboard/></div> 
  }
  
])


function App() {

  return (
  <div>
    <RouterProvider router={router}/>
  </div>
  )
}

export default App