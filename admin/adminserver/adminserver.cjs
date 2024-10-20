const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// MySQL Database Connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Your MySQL password
  database: 'capstone' // Your database name
});

// Start the server
app.listen(5001, () => {
  console.log('Server running on port 5001');
});

// Admin Login
app.post('/api/adminlogin', async (req, res) => {
  const { adminusername, adminpassword } = req.body;

  try {
    const query = 'SELECT * FROM admin WHERE adminusername = ?';
    db.query(query, [adminusername], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = result[0];
      const isMatch = (adminpassword === user.adminpassword);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const adminData = {
        adminusername: user.adminusername,
        adminpassword: user.adminpassword
      };

      res.status(200).json({ message: 'Login successful', user: adminData });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch Pending Clients
app.get('/api/pending-clients', (req, res) => {
  const query = 'SELECT * FROM pending_clients WHERE isApproved = 0'; // Only select pending clients
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching pending clients' });
    }
    res.status(200).json(result); // Send pending clients data to the front-end
  });
});

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jeodalyn.edulag@students.isatu.edu.ph', // replace with your email
    pass: 'byhy hbqg dbww iekf' // replace with your email password
  }
});

// Approve Client
app.post('/api/approve-client', async (req, res) => {
  const { id } = req.body;

  // Fetch client info before approving
  const pendingClientQuery = 'SELECT * FROM pending_clients WHERE id = ?';
  db.query(pendingClientQuery, [id], (err, clientResult) => {
    if (err || clientResult.length === 0) {
      return res.status(500).json({ error: 'Client not found in pending list' });
    }

    const client = clientResult[0];

    // Insert client into the approved table
    const approveQuery = `
      INSERT INTO client (fname, lname, contactno, birthdate, zone, brgy, municipal, sex, email, username, pass, busname, busadd, busdocs, isApproved)
      SELECT fname, lname, contactno, birthdate, zone, brgy, municipal, sex, email, username, pass, busname, busadd, busdocs, 1 
      FROM pending_clients WHERE id = ?`;

    db.query(approveQuery, [id], (err, result) => {
      if (err) {
        console.error('Error approving client:', err);
        return res.status(500).json({ error: 'Error approving client', details: err });
      }

      // Send approval email
      const mailOptions = {
        from: 'jeodalyn.edulag@students.isatu.edu.ph',
        to: client.email,
        subject: 'Registration Approved',
        text: `Dear MR/MRS ${client.fname},\n\nYour registration has been approved! You can now access our services.\n\n
        Your username: ${client.username}\n +
        Your password: ${client.pass}\n\n + 
        Best regards,\n-Admin Team`
      };

      transporter.sendMail(mailOptions, (emailErr, info) => {
        if (emailErr) {
          console.error('Error sending approval email:', emailErr);
          return res.status(500).json({ error: 'Error sending approval email' });
        }

        // Delete from pending_clients after successful approval
        const deleteQuery = 'DELETE FROM pending_clients WHERE id = ?';
        db.query(deleteQuery, [id], (deleteErr) => {
          if (deleteErr) {
            console.error('Error deleting client from pending list:', deleteErr);
            return res.status(500).json({ error: 'Error deleting client from pending list' });
          }
          res.status(200).json({ message: 'Client approved successfully and email sent' });
        });
      });
    });
  });
});

// Reject Client
app.post('/api/reject-client', (req, res) => {
  const { id } = req.body;

  const query = 'DELETE FROM pending_clients WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error rejecting client' });
    }
    res.status(200).json({ message: 'Client rejected successfully' });
  });
});
