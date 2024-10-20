import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faRightFromBracket, faUserCheck, faUserPlus, faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './manageacc.css';
import axios from 'axios';

const _manageacc = () => {
  const [userData, setUserData] = useState({ fname: '', busname: '', lname: '', owner_id: '' });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    empfname: '',
    emplname: '',
    empcontact: '',
    empbirth: '',
    empbrgy: '',
    empmunicipal: '',
    empuser: '',
    emppass: '',
  });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Fetch owner data from localStorage when the component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Ensure the owner_id is present before fetching employees
  useEffect(() => {
    if (userData.owner_id) {
      fetchEmployees(); // Fetch employees only when owner_id is available
    }
  }, [userData.owner_id]);

  // Fetch employees based on the logged-in owner's owner_id
  const fetchEmployees = () => {
    axios.get('http://localhost:5000/api/employees', {
      params: { owner_id: userData.owner_id } // Pass owner_id as query parameter
    })
      .then(response => {
        console.log('API Response:', response.data);
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Front-end validation for contact number (exactly 11 digits)
    if (formData.empcontact.length !== 11) {
      alert('Contact number must be exactly 11 digits.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/empregister', { ...formData, owner_id: userData.owner_id }); // Include owner_id
      alert('Employee registered successfully');
      
      setFormData({
        empfname: '',
        emplname: '',
        empcontact: '',
        empbirth: '',
        empbrgy: '',
        empmunicipal: '',
        empuser: '',
        emppass: '',
      });

      fetchEmployees(); // Refresh the employee list
      toggleForm();
    } catch (error) {
      console.error('Error registering employee:', error);
      alert(`Failed to register employee: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeEmployeeDetails = () => {
    setSelectedEmployee(null);
  };

  return (
    <>
      <section>
        <div className="boxed">
          <div className="clients">
            <h1>{userData.fname} {userData.lname}</h1>
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
            <div className="ordericon">
              <FontAwesomeIcon icon={faUserCheck} />
            </div>
            <p>Manage Account</p>
          </div>
          <div className="adduseracc" onClick={toggleForm}>
            <FontAwesomeIcon icon={faUserPlus} />
          </div>
        </div>

        {/* Employee List */}
        {employees.length > 0 ? (
          employees.map((employee, index) => (
            <div className="employees" key={employee.emp_id} onClick={() => handleEmployeeClick(employee)}>
              <div className="emp">
                <h1>Employee {index + 1}</h1>
              </div>
            </div>
          ))
        ) : (
          <p>No employees found.</p>
        )}
      </div>

      {/* Employee Registration Form */}
      <div className={`slideout-form ${showForm ? 'visible' : ''}`}>
        <div className="close-button" onClick={toggleForm}>
          <FontAwesomeIcon icon={faTimes} />
        </div>

        <form onSubmit={handleSubmit}>
          <h2>Register Employee</h2>
          <div className="inputemp">
            <div className="inputemployee">
              <input type="text" name="empfname" placeholder="First name" value={formData.empfname} onChange={handleInputChange} required />
              <input type="text" name="emplname" placeholder="Last name" value={formData.emplname} onChange={handleInputChange} required />
            </div>
            <div className="inputemployee">
              <input
                type="text"
                name="empcontact"
                placeholder="Contact Number"
                value={formData.empcontact}
                onChange={handleInputChange}
                required
                maxLength={11} // Limit to 11 digits
                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')} // Only numbers
              />
              <input type="text" name="empbirth" placeholder="Birthdate" value={formData.empbirth} onChange={handleInputChange} required onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} />
            </div>
            <div className="inputemployee">
              <input type="text" name="empbrgy" placeholder="Barangay" value={formData.empbrgy} onChange={handleInputChange} required />
              <input type="text" name="empmunicipal" placeholder="Municipal/City" value={formData.empmunicipal} onChange={handleInputChange} required />
            </div>
            <div className="inputemployee">
              <input type="text" name="empuser" placeholder="Username" value={formData.empuser} onChange={handleInputChange} required />
              <input type="password" name="emppass" placeholder="Password" value={formData.emppass} onChange={handleInputChange} required />
            </div>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>

      {selectedEmployee && (
        <div className="slideout-formemp visible">
          <div className="closemp-button" onClick={closeEmployeeDetails}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className="emptable">
            <h2>Employee {selectedEmployee.id}</h2>
            <h5>Information</h5>
            <div className="employee-details">
              <div className="inputemployee">
                <label>First name</label>
                <input type="text" value={selectedEmployee.empfname} readOnly />
              </div>
              <div className="inputemployee">
                <label>Last name</label>
                <input type="text" value={selectedEmployee.emplname} readOnly />
              </div>
              <div className="inputemployee">
                <label>Contact number</label>
                <input type="text" value={selectedEmployee.empcontact} readOnly />
              </div>
              <div className="inputemployee">
                <label>Birthdate</label>
                <input type="text" value={selectedEmployee.empbirth} readOnly />
              </div>
              <div className="inputemployee">
                <label>Barangay</label>
                <input type="text" value={selectedEmployee.empbrgy} readOnly />
              </div>
              <div className="inputemployee">
                <label>Municipality/City</label>
                <input type="text" value={selectedEmployee.empmunicipal} readOnly />
              </div>
              <div className="inputemployee">
                <label>Username</label>
                <input type="text" value={selectedEmployee.empuser} readOnly />
              </div>
              <div className="inputemployee">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={selectedEmployee.emppass}
                    readOnly
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={togglePasswordVisibility}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%) translateX(-200%)',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default _manageacc;
