import React, { useState } from 'react';
import './register.css';
import '../../App.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    contactno: '',
    birthdate: '',
    zone: '',
    brgy: '',
    municipal: '',
    sex: '',
    email: '',
    username: '',
    pass: '',
    confpass: '',
    busname: '',
    busadd: '',
    busdocs: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const passwordStrengthColor = {
    Weak: 'red',
    Medium: 'orange',
    Strong: 'green'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'pass') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = '';
    const lengthCheck = password.length >= 8;
    const numberCheck = /[0-9]/.test(password);
    const upperCheck = /[A-Z]/.test(password);

    if (lengthCheck && numberCheck && upperCheck) {
      strength = 'Strong';
    } else if (lengthCheck && (specialCheck)) {
      strength = 'Medium';
    } else {
      strength = 'Weak';
    }
    setPasswordStrength(strength);
  };

  const handleFileChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      busdocs: e.target.files[0]
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.pass !== formData.confpass) {
      alert('Passwords do not match');
      return;
    }

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      console.log('Response:', result);

      if (response.ok) {
        console.log('Success:', result);
        setShowPopup(true);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  const gologin = () => {
    window.location.href = '/';
  };

  const registeragain = () => {
    setShowPopup(false);
  }

  return (
    <>
      <title>Register</title>
      <div className="backgr">
        <div className="registration">
          <section className="box">
            <form onSubmit={handleSubmit} className="form">
              <header>Registration</header>
              <div className="column">
                <div className="input">
                  <input
                    type="text"
                    name="fname"
                    placeholder="First Name"
                    value={formData.fname}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="lname"
                    placeholder="Last Name"
                    value={formData.lname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="column">
                <div className="input">
                  <input
                    type="text"
                    name="contactno"
                    placeholder="Contact Number"
                    value={formData.contactno}
                    onChange={handleInputChange}
                    required
                    maxLength={11} 
                    pattern="?[0-9]{10}"
                    onKeyDown={(e) => {
                    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
                    const regex = /^[0-9\b]+$/;
                    if (!regex.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                  }
                }}
                  />
                  <input
                    type="text"
                    name="birthdate"
                    placeholder="Birthday"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = 'text')}
                    value={formData.birthdate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="input">
                <input
                  type="text"
                  name="zone"
                  placeholder="House No, Blk, St., Zone"
                  value={formData.zone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="column">
                <div className="input">
                  <input
                    type="text"
                    name="brgy"
                    placeholder="Barangay"
                    value={formData.brgy}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="municipal"
                    placeholder="Municipal, City or Province"
                    value={formData.municipal}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="sex-box">
                <h3>Sex</h3>
                <div className="sex-option">
                  <div className="sex">
                    <input
                      type="radio"
                      name="sex"
                      value="male"
                      onChange={handleInputChange}
                      required
                    />
                    <label>Male</label>
                  </div>
                  <div className="sex">
                    <input
                      type="radio"
                      name="sex"
                      value="female"
                      onChange={handleInputChange}
                      required
                    />
                    <label>Female</label>
                  </div>
                </div>
              </div>
              <header>Account</header>
              <div className="input">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
                  <div className="passh5">
                  <h5>Password must have atleast 1 uppercase letter</h5>
                  </div>
              <div className="column">
                <div className="input">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="pass"
                    placeholder="Password"
                    value={formData.pass}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confpass"
                    placeholder="Confirm Password"
                    value={formData.confpass}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="passwords">
                  <div className = "strength" style={{ color: passwordStrengthColor[passwordStrength] }}>
                    Password Strength: {passwordStrength}
                  </div>
              <div className="toggle-password">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                  />
                <label htmlFor="showPassword"> Show Password</label>
                  </div>
              </div>
              <header>Business</header>
              <div className="input">
                <input
                  type="text"
                  name="busname"
                  placeholder="Business Name"
                  value={formData.busname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input">
                <input
                  type="text"
                  name="busadd"
                  placeholder="Business Address (Zone, Municipality, City, or Province)"
                  value={formData.busadd}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="businessdocs">
                <h3>Upload Business Documents</h3>
                <div className="filed">
                  <input
                    type="file"
                    name="busdocs"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="button">Register</button>
              <footer>
                <span>
                  Already a member? <a href="/">Sign in</a>
                </span>
              </footer>
            </form>
          </section>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Registration Successful!</h2>
            <p>Your registration is complete, but you are waiting for admin approval before you can log in.</p>
            <button onClick={gologin}>Go to Login</button>
            <button onClick={registeragain}>Go Back</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
