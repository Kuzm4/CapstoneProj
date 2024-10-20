import './App.css'
import _dashboard from './components/dashboard/dashboard1/dashboard'
import _login from './components/login/login'
import _register from './components/register/register'
import _order from './components/dashboard/order/order'
import _schedule from './components/dashboard/schedule/schedule'
import _waterlevel from './components/dashboard/waterlevel/waterlevel'
import _inventory from './components/dashboard/inventory/inventory'
import _manageacc from './components/dashboard/manageaccount/manageacc'
import _resetpassword from './components/resetpassword/resetpassword'


import {
  createBrowserRouter,
  RouterProvider, Link
} from 'react-router-dom'

const router = createBrowserRouter ([
  {
    path: '/',
    element: <div><_login/></div> 
  },
  {
    path: '/register',
    element: <div><_register/></div> 
  },
  {
    path: '/dashboard',
    element: <div><_dashboard/></div> 
  },
  {
    path: '/order',
    element: <div><_order/></div> 
  },
  {
    path: '/schedule',
    element: <div><_schedule/></div> 
  },
  {
    path: '/waterlevel',
    element: <div><_waterlevel/></div> 
  },
  {
    path: '/inventory',
    element: <div><_inventory/></div> 
  },
  {
    path: '/manageaccount',
    element: <div><_manageacc/></div> 
  },
  {
    path: '/reset-password/:token',
    element: <div><_resetpassword/></div> 
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
