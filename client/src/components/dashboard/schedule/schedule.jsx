import React, {useEffect, useState} from 'react'
import '../schedule/schedule.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarCheck, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons'

function _schedule() {

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
      <h1>{userData.fname } {userData.lname}</h1>
      <h4>{userData.busname}</h4>
    </div>
    <div className="dashboard">
      <a href="/dashboard">
      <div className="goback">
      <FontAwesomeIcon icon={faAnglesLeft} />
      </div>
      </a>
  
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
       <div className="schedicon">
       <FontAwesomeIcon icon={faCalendarCheck} />
       </div>
       <p>Schedule</p>
       <div className="usercalendar">
            <div className="userplus">
            <FontAwesomeIcon icon={faUserPlus} />
            </div>
            <div className="calendardays">
            <FontAwesomeIcon icon={faCalendarDays} />
            </div>
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
        <div className="kalendaryo">
          <h1>6-31-24</h1>
        <div className="day">
          <p>Tomorrow</p>
        </div>
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
        <div className="kalendaryo">
          <h1>6-31-24</h1>
        <div className="day">
          <p>Tomorrow</p>
        </div>
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
        <div className="kalendaryo">
          <h1>6-31-24</h1>
        <div className="day">
          <p>Tomorrow</p>
        </div>
        </div>
      </div>


      </div>
    </div>
  
  )
}

export default _schedule
