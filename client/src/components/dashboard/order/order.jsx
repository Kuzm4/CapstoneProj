import React, {useState, useEffect} from 'react'
import '../order/order.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom'


const _order = () => {

    const [userData, setUserData] = useState({ fname: '', busname:'' , lname: ''});
  
    useEffect(() => {
      // Retrieve user data from localStorage
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    }, []);

  return (
    <div>
      <section>
    <div className="boxed">
    <div className="clients">
      <h1>{userData.fname } {userData.lname }</h1>
      <h4>{userData.busname}</h4>
    </div>
    <div className="dashboard">
      <Link to={'/dashboard'}>
      <div className="goback">
      <FontAwesomeIcon icon={faAnglesLeft} />
      </div>
      </Link>
  
    <div className="logouts">
      <a href="/">
      <FontAwesomeIcon icon={faRightFromBracket} />
      </a>
    </div>
    </div>
    </div>
</section>
    <div className="maind">
        <div className="displayflex">
        <div className="pampalipasoras">
        <div className="ordericon">
        <FontAwesomeIcon icon={faCartPlus} />
        </div>
        <p>Orders</p>
        </div>
        </div>



   
        <div className="customer">
        <div className="customer1">
            <h1>Customer 1</h1>
        <div className="cus1add">
            <span>Zone, Municipality, City, Province</span>
        </div>
        </div>
        <div className="orderdet">
            <h1>Order Details</h1>
            <div className="gallon">
                <span># Gallons</span>
            </div>
        </div>
        <div className="datetime">
            <h1>Date & Time</h1>
        </div>
        <div className="verify">
        <FontAwesomeIcon icon={faCircleCheck} />
        <FontAwesomeIcon icon={faCircleXmark} />
        </div>
        </div>

        <div className="customer">
        <div className="customer2">
            <h1>Customer 2</h1>
        <div className="cus2add">
            <span>Zone, Municipality, City, Province</span>
        </div>
        </div>
        <div className="orderdet">
            <h1>Order Details</h1>
            <div className="gallon">
                <span># Gallons</span>
            </div>
        </div>
        <div className="datetime">
            <h1>Date & Time</h1>
        </div>
        <div className="verify">
        <FontAwesomeIcon icon={faCircleCheck} />
        <FontAwesomeIcon icon={faCircleXmark} />
        </div>
        </div>

        <div className="customer">
        <div className="customer3">
            <h1>Customer 3</h1>
        <div className="cus3add">
            <span>Zone, Municipality, City, Province</span>
        </div>
        </div>
        <div className="orderdet">
            <h1>Order Details</h1>
            <div className="gallon">
                <span># Gallons</span>
            </div>
        </div>
        <div className="datetime">
            <h1>Date & Time</h1>
        </div>
        <div className="verify">
        <FontAwesomeIcon icon={faCircleCheck} />
        <FontAwesomeIcon icon={faCircleXmark} />
        </div>
        </div>
        </div>
    </div>
    
  )
}

export default _order
