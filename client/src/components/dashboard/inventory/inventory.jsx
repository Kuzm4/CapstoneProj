import React, {useState, useEffect} from 'react'
import '../inventory/inventory.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

const _inventory = () => {

  const [userData, setUserData] = useState({fname:'', busname:'' , lname: ''});
  
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
          <div className="pampalipasoras">
          <div className="inventicon">
          <FontAwesomeIcon icon={faClipboardList} />
          </div>
          <div className="inventcus">
          <h1>Inventory</h1>
          <h4>Customer</h4>
          </div>
          </div>
        </div>

          <div className="customer">
            <div className="customerinventory">
            <div className="custinv1">
              <h1>Customer1</h1>
              <h5>Zone, Municipality, City, Province</h5>
              <h5>07/09/2024    9:00 am</h5>
            </div>
            <div className="chev">
            <FontAwesomeIcon icon={faChevronDown} />
            </div>
            </div>
          </div>

          <div className="customer">
            <div className="customerinventory">
            <div className="custinv2">
              <h1>Customer 2</h1>
              <h5>Zone, Municipality, City, Province</h5>
              <h5>07/09/2024    9:00 am</h5>
            </div>
            <div className="chev">
            <FontAwesomeIcon icon={faChevronDown} />
            </div>
            </div>
          </div>

          <div className="customer">
            <div className="customerinventory">
            <div className="custinv3">
              <h1>Customer 3</h1>
              <h5>Zone, Municipality, City, Province</h5>
              <h5>07/09/2024    9:00 am</h5>
            </div>
            <div className="chev">
            <FontAwesomeIcon icon={faChevronDown} />
            </div>
            </div>
            
          </div>
      </div>
    </div>
  )
}

export default _inventory
