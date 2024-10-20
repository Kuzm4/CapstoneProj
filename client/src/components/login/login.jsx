import React, { useState } from 'react';
import './login1.css';
import '../../App.css';

const _login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '', 
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle for forgot password
  const [email, setEmail] = useState(''); // State for handling email during password reset

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));  
  };

  const handleForgotPasswordChange = (e) => {
    setEmail(e.target.value); // Set the email input for forgot password
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isForgotPassword) {
      // Handle forgot password process
      try {
        const response = await fetch('http://localhost:5000/api/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message || 'A password reset link has been sent to your email.');
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to send reset email.');
          alert(errorData.message || 'Failed to send reset email.');
        }
      } catch (error) {
        setErrorMessage('Error connecting to the server. Please try again later.');
        alert('Error connecting to the server. Please try again later.');
      }
    } else {
      // Normal login process
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          localStorage.setItem('userData', JSON.stringify(result.user));
          window.location.href = '/dashboard';
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Login failed.');
          alert(errorData.message || 'Invalid username or password.');
        }
      } catch (error) {
        setErrorMessage('Error connecting to the server. Please try again later.');
        alert('Error connecting to the server. Please try again later.');
      }
    }
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true); // Toggle to forgot password form
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false); // Go back to the login form
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
                <h1>{isForgotPassword ? 'Forgot Password' : 'Login'}</h1>
              </div>
              <form onSubmit={handleSubmit} className="form grid">
                {!isForgotPassword ? (
                  <>
                    <div className="inputDiv">
                      <div className="input flex">
                        <input
                          type="text"
                          name="username"
                          id="username"
                          placeholder="Username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="inputDiv">
                      <div className="input flex">
                        <input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="forgotpass" onClick={handleForgotPasswordClick}>
                      <p>Forgot password?</p>
                    </div>
                  </>
                ) : (
                  <div className="inputDiv">
                    <div className="input flex">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleForgotPasswordChange}
                        required
                      />
                    </div>
                      <div className="backToLogin" style={{right: '20px'}} onClick={handleBackToLogin}>
                      <p>← Back to Login</p>
                    </div>
                  </div>
                )}
                <button type="submit" className="btn flex">
                  <span>{isForgotPassword ? 'Reset Password' : 'Login'}</span>
                </button>
                {!isForgotPassword && (
                  <div className="link">
                    Don't have an account yet? <a href="/register">Sign up</a>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default _login;
