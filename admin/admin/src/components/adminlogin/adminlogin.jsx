import React, { useState } from 'react';
import '../adminlogin/adminlogin.css';

const _adminlogin = () => {

    const [formData, setFormData] = useState({
      adminusername: '', // Corrected here
      adminpassword: '', 
    });
  
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));  
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const response = await fetch('http://localhost:5001/api/adminlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        if (response.ok) {
          const result = await response.json();
    
          // Store the user data in localStorage
          localStorage.setItem('userData', JSON.stringify(result.user));
    
          // Redirect to the dashboard
          window.location.href = '/admindashboard';
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Login failed.');
          alert(errorData.message || 'Invalid username or password.');
        }
      } catch (error) {
        setErrorMessage('Error connecting to the server. Please try again later.');
        alert('Error connecting to the server. Please try again later.');
      }
    };

  return (
    <>
      <div className="home">
        <div className="loginpage flex">
          <img src="src/assets/back.jpg" alt="Background" />
          <div className="container flex">
            <div className="text">
              <div className="logo">
                <img src="src/assets/logo.png" alt="Logo" />
              </div>
              <div className="slogan">
                <p>Unleash the power of Hydration</p>
              </div>
            </div>
            <div className="formDiv flex">
              <div className="headerDiv">
                <h1>Admin Login</h1>
              </div>
              <form onSubmit={handleSubmit} className="form grid">
                <div className="inputDiv">
                  <div className="input flex">
                    <input
                      type="text"
                      name="adminusername" // Corrected here
                      id="adminusername"
                      placeholder="Username"
                      value={formData.adminusername} // Corrected here
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="inputDiv">
                  <div className="input flex">
                    <input
                      type="password"
                      name="adminpassword"
                      id="adminpassword"
                      placeholder="Password"
                      value={formData.adminpassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn flex">
                  <span>Login</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default _adminlogin;
