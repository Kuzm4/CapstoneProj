import React, { useEffect, useState } from 'react';
import '../../../components/dashboard/dashboard1/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCalendarCheck, faBottleWater, faClipboardList, faUserCheck, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const _dashboard = () => {
  const [userData, setUserData] = useState({ fname: '', busname: '', lname: '' });

  const openBlynkDashboard = (e) => {
    e.preventDefault(); // Prevents default anchor behavior
    window.open('https://sgp1.blynk.cloud/dashboard/591104/global/devices/5053173/organization/591104/devices/2595292/dashboard', '_blank');
  };

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
        <div className="main">
          <div className="client">
            {/* Fallback if no user data */}
            <h1>{userData.fname || 'Guest'} {' '}
                  {userData.lname || ''}
            </h1>
            <h4>{userData.busname || 'No business name available'}</h4>
          </div>
          <div className="logout">
            <a href="/" onClick={() => localStorage.removeItem('userData')}>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </a>
          </div>
        </div>
      </section>

      <div className="maind">
        <div className="icon">
          <div className="icons">
            <Link to={'/order'}>
              <div className="cart">
                <FontAwesomeIcon icon={faCartPlus} />
                <div className="ordername">Orders</div>
              </div>
            </Link>
            <Link to={'/schedule'}>
              <div className="calendar">
                <FontAwesomeIcon icon={faCalendarCheck} />
                <div className="calendarname"><p>Schedule</p></div>
              </div>
            </Link>
            <div className="waterbot" onClick={openBlynkDashboard}>
              <FontAwesomeIcon icon={faBottleWater} />
              <div className="watername"><p>Water Level</p></div>
            </div>
          </div>

          <div className="icons2">
            <Link to={'/inventory'}>
              <div className="checklist">
                <FontAwesomeIcon icon={faClipboardList} />
                <div className="checkname">Inventory</div>
              </div>
            </Link>
            <Link to={'/manageaccount'}>
              <div className="usercheck">
                <FontAwesomeIcon icon={faUserCheck} />
                <div className="usercheckname">Manage Account</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default _dashboard;
