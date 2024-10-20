import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './resetpassword.css'; // Ensure the path is correct
import '../../App.css'

const _resetpassword = () => {
  const { token } = useParams(); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reset-password/${token}`, { method: 'GET' });
        if (response.ok) {
          setIsTokenValid(true);
        } else {
          setErrorMessage('Invalid or expired token.');
        }
      } catch (error) {
        setErrorMessage('Error connecting to the server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message || 'Password has been reset. You can now log in.');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to reset password.');
      }
    } catch (error) {
      setErrorMessage('Error connecting to the server. Please try again later.');
    }
  };
  
  if (loading) {
    return <div>Loading...</div>; 
  }

  return (

      <div className="reset-password">
      <h1>Reset Password</h1>
      {isTokenValid ? (
        <form onSubmit={handleSubmit}>
          <div className="inputDiv">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              />
          </div>
          <div className="inputDiv">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              />
          </div>
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <button type="submit" className="btn">Reset Password</button>
        </form>
      ) : (
        <p>{errorMessage}</p>
      )}
    </div>
  );  
};

export default _resetpassword;
