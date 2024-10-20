import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import '../admindashboard/admindashboard.css';

const _admindashboard = () => {
  const [pendingClients, setPendingClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopupapprove, setShowPopupapprove] = useState(false);
  const [showPopupreject, setshowPopupreject] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null); // To store the client id to be approved/rejected

  // Fetch pending clients from the server
  useEffect(() => {
    const fetchPendingClients = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/pending-clients');
        setPendingClients(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching pending clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingClients();
  }, []);

  // Approve client
  const approveClient = async (id) => {
    setShowPopupapprove(false); // Close popup immediately
    
    // Optimistically update the UI
    const updatedClients = pendingClients.filter(client => client.id !== id);
    setPendingClients(updatedClients); // Update the pending clients list immediately
    
    try {
      await axios.post('http://localhost:5001/api/approve-client', { id });
      // Optionally, refetch the clients if you want to get the latest state
      // await fetchPendingClients();
    } catch (error) {
      console.error('Error approving client:', error);
      // Rollback in case of error
      setPendingClients(pendingClients); // Restore the previous state
    }
  };
  
  //Reject Client
  const rejectClient = async (id) => {
    setshowPopupreject(false); // Close popup immediately
    
    // Optimistically update the UI
    const updatedClients = pendingClients.filter(client => client.id !== id);
    setPendingClients(updatedClients); // Update the pending clients list immediately
    
    try {
      await axios.post('http://localhost:5001/api/reject-client', { id });
      // Optionally, refetch the clients if you want to get the latest state
      // await fetchPendingClients();
    } catch (error) {
      console.error('Error rejecting client:', error);
      // Rollback in case of error
      setPendingClients(pendingClients); // Restore the previous state
    }
  };
  

  // Handle close popup
  const close = () => {
    setShowPopupapprove(false);
    setshowPopupreject(false);
    setSelectedClientId(null); // Reset selected client id
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <header>
        <div className="mainbox">
          <div className="admin">
            <h1>Admin</h1>
          </div>
          <div className="adminlogout">
            <a href='/'>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </a>
          </div>
        </div>
      </header>

      <div className="pending">
        <h1>Pending Client Registrations</h1>
        {pendingClients.length === 0 ? (
          <p>No pending clients.</p>
        ) : (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Business Name</th>
                  <th>Business Address</th>
                  <th>Business Email</th>
                  <th>Business Docs</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingClients.map(client => (
                  <tr key={client.id}>
                    <td>{client.fname}</td>
                    <td>{client.lname}</td>
                    <td>{client.busname}</td>
                    <td>{client.busadd}</td>
                    <td>{client.email}</td>
                    <td>
                      {client.busdocs ? (
                        <a href={`http://localhost:5000/uploads/${client.busdocs}`} target="_blank" rel="noopener noreferrer">
                          View Document
                        </a>
                      ) : (
                        'No document'
                      )}
                    </td>
                    <td>
                      <div className="button">
                        <div className="check">
                          <button onClick={() => { setShowPopupapprove(true); setSelectedClientId(client.id); }}>
                            <FontAwesomeIcon icon={faCircleCheck} />
                          </button>
                        </div>
                        <div className="reject">
                          <button onClick={() => { setshowPopupreject(true); setSelectedClientId(client.id); }}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPopupapprove && (
        <div className="popupmain">
          <div className="popupbox">
            <h2>Are you sure you want to approve?</h2>
            <div className="butyes">
              <button onClick={() => approveClient(selectedClientId)}>Yes</button>
            </div>
            <div className="butclose">
              <button onClick={close}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showPopupreject && (
        <div className="popupmain">
          <div className="popupbox">
            <h2>Are you sure you want to reject?</h2>
            <div className="butyes">
              <button onClick={() => rejectClient(selectedClientId)}>Yes</button>
            </div>
            <div className="butclose">
              <button onClick={close}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default _admindashboard;
