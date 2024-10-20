const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// MySQL Database Connection  
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'capstone'
});

// Serve the uploads directory for document access
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

// Register Endpoint
app.post('/api/register', upload.single('busdocs'), async (req, res) => {
  const { fname, lname, contactno, birthdate, zone, brgy, municipal, sex, email, username, pass, busname, busadd } = req.body;
  const busdocs = req.file ? req.file.filename : null;

  try {
    const checkUserQuery = `
    SELECT owner_id, username, busname, email FROM client WHERE username = ? OR busname = ? OR email = ?
    UNION
    SELECT id, username, busname, email FROM pending_clients WHERE username = ? OR busname = ? OR email = ?`;


    db.query(checkUserQuery, [username, busname, email, username, busname, email], async (err, results) => {
      if (err) {
        console.error('Error checking existing user:', err);
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      if (results.length > 0) {
        const existingUser = results.find(user => user.username === username);
        const existingBus = results.find(user => user.busname === busname);
        const existingEmail = results.find(user => user.email === email);

        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }

        if (existingBus) {
          return res.status(400).json({ message: 'Business name already exists' });
        }

        if (existingEmail) {
          return res.status(400).json({ message: 'Email already exists' });
        }
      }

      const hashedPassword = await bcrypt.hash(pass, 10);

      const query = `
        INSERT INTO pending_clients (fname, lname, contactno, birthdate, zone, brgy, municipal, sex, email, username, pass, busname, busadd, busdocs, isApproved) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`;

      const values = [fname, lname, contactno, birthdate, zone, brgy, municipal, sex, email, username, hashedPassword, busname, busadd, busdocs];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error saving to pending_clients:', err);
          return res.status(500).json({ message: 'Error saving to pending_clients', error: err.message });
        }
        console.log('Successfully inserted into pending_clients:', result);
        res.status(200).json({ message: 'User registered successfully, awaiting admin approval' });
      });
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM client WHERE username = ? AND isApproved = 1';
    db.query(query, [username], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.pass);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const userData = {
        owner_id: user.owner_id,
        fname: user.fname,
        lname: user.lname,
        contactno: user.contactno,
        birthdate: user.birthdate,
        zone: user.zone,
        brgy: user.brgy,
        municipal: user.municipal,
        sex: user.sex,
        email: user.email,
        username: user.username,
        busname: user.busname,
        busadd: user.busadd,
        busdocs: null
      };

      res.status(200).json({ message: 'Login successful', user: userData });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register Employee API
app.post('/api/empregister', async (req, res) => {
  const { empfname, emplname, empcontact, empbirth, empbrgy, empmunicipal, empuser, emppass, owner_id } = req.body; // Add empemail to the destructuring

// Ensure owner_id is provided
if (!owner_id) {
  return res.status(400).send({ message: 'Owner ID is required' });
}

  try {
    const checkUserQuery = 'SELECT * FROM employees WHERE empuser = ?';
    db.query(checkUserQuery, [empuser], (err, results) => {
      if (err) {
        console.error('Error checking existing employee:', err);
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      if (results.length > 0) {
        const existingUser = results.find(user => user.empuser === empuser);

        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }
      }

      // Hash the password
      bcrypt.hash(emppass, 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ message: 'Error hashing password', error: err.message });
        }

        // Insert new employee into database
        const query = 'INSERT INTO employees (empfname, emplname, empcontact, empbirth, empbrgy, empmunicipal, empuser, emppass, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [empfname, emplname, empcontact, empbirth, empbrgy, empmunicipal, empuser, emppass, owner_id]; // Use hashed password

        db.query(query, values, (err, result) => {
          if (err) {
            console.error('Error saving to employee:', err);
            return res.status(500).json({ message: 'Error saving to employee', error: err.message });
          }
          console.log('Successfully inserted into employee:', result);
          res.status(200).json({ message: 'Employee registered successfully' });
        });
      });
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
});

// Get All Employees API
app.get('/api/employees', (req, res) => {
  const { owner_id, empcontact } = req.query;

  // Ensure owner_id is provided
  if (!owner_id) {
    return res.status(400).json({ message: 'Owner ID is required' });
  }

  // Optional: Validate contact number if provided (exactly 11 digits)
  if (empcontact && !/^\d{11}$/.test(empcontact)) {
    return res.status(400).json({ message: 'Contact number must be exactly 11 digits.' });
  }

  // Prepare query with filtering by owner_id
  let query = 'SELECT * FROM employees WHERE owner_id = ?';
  let queryParams = [owner_id];

  // Optional: Add filter for contact number if provided
  if (empcontact) {
    query += ' AND empcontact = ?';
    queryParams.push(empcontact);
  }

  // Execute the query with the owner_id (and optionally empcontact)
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    res.status(200).json(results); // Return results directly
  });
});

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
 app.use(cors({
   origin: allowedOrigins,
   credentials: true,
 }));

app.use(express.json());

// Forgot Password Endpoint
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log('Email is required');
    return res.status(400).json({ message: 'Email is required' });
  }

  // Generate a token and expiration time
  const token = crypto.randomBytes(20).toString('hex');
  const expirationTime = new Date(Date.now() + 3600000); // 1 hour

  // Check if email exists in the database
  const query = 'SELECT * FROM client WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ message: 'No account with that email address exists' });
    }

    // Update the user with the reset token and expiration time
    const updateQuery = `
      UPDATE client 
      SET reset_password_token = ?, reset_password_expires = ?
      WHERE email = ?
    `;
    db.query(updateQuery, [token, expirationTime, email], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      const resetUrl = `http://localhost:5000/reset-password/${token}`; // Update with your frontend URL

      const mailOptions = {
        from: 'jeodalyn.edulag@students.isatu.edu.ph',
        to: email,
        subject: 'Password Reset',
        text: `You are receiving this email because you requested a password reset. Please click on the following link, or paste it into your browser to complete the process: ${resetUrl}`,
      };

      // Send email using Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'jeodalyn.edulag@students.isatu.edu.ph',
          pass: 'byhy hbqg dbww iekf',
        },
      });

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error sending email' });
        }

        res.status(200).json({ message: 'Password reset email sent' });
      });
    });
  });
});

const bodyParser = require('body-parser');

app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, '../dist')));

// Reset Password Page Token Verification
app.get('/api/reset-password/:token', (req, res) => {
  const { token } = req.params;

  const query = 'SELECT * FROM client WHERE reset_password_token = ? AND reset_password_expires > NOW()';
  db.query(query, [token], (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }
    res.status(200).json({ message: 'Token is valid' });
  });
});

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Reset Password Endpoint
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const query = 'SELECT * FROM client WHERE reset_password_token = ? AND reset_password_expires > NOW()';
  db.query(query, [token], async (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = `
      UPDATE client 
      SET pass = ?, reset_password_token = NULL, reset_password_expires = NULL
      WHERE reset_password_token = ?
    `;
    db.query(updateQuery, [hashedPassword, token], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error resetting password' });
      }

      res.status(200).json({ message: 'Password has been reset' });
    });
  });
});




