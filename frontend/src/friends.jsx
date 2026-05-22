import { useState, useEffect } from 'react';

function FriendRequest({ loggedInUser })
{
    const [username, setUsername] = useState('');
    const [sendRequest, setSendRequest] = useState(false);
    const [incomingRequests, setIncomingRequests] = useState([]);

    useEffect(() => {
        // Fetch incoming friend requests when user logs in
        if (loggedInUser) {
            fetchIncomingRequests();
        }
    }, [loggedInUser]);

    const fetchIncomingRequests = async () => {
        try {
            const response = await fetch(`http://localhost:3000/friend/get-requests/${loggedInUser}`);
            const data = await response.json();
            
            if (data.success) {
                setIncomingRequests(data.requests);
                console.log('Incoming requests:', data.requests);
            } else {
                console.error('Error fetching requests:', data.message);
            }
        } catch (err) {
            console.error('Error fetching incoming requests:', err);
        }
    };

    const handleSendFriendRequest = async () => {
        try {
            const response = await fetch('http://localhost:3000/friend/send-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    fromUsername: loggedInUser,
                    toUsername: username 
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log('Friend request sent successfully!');
                setUsername('');
                setSendRequest(false);
            } else {
                console.error('Error:', data.error);
            }
        } catch (err) {
            console.error('Error sending friend request:', err);
        }
    };

    const handleAcceptRequest = async (fromUsername) => {
        try {
            const response = await fetch('http://localhost:3000/friend/accept-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    toUsername: loggedInUser,
                    fromUsername: fromUsername
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log('Friend request accepted!');
                setIncomingRequests(incomingRequests.filter(req => req !== fromUsername));
            } else {
                console.error('Error accepting request:', data.message);
            }
        } catch (err) {
            console.error('Error accepting friend request:', err);
        }
    };

    const handleRejectRequest = async (fromUsername) => {
        try {
            const response = await fetch('http://localhost:3000/friend/reject-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    toUsername: loggedInUser,
                    fromUsername: fromUsername
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log('Friend request rejected!');
                setIncomingRequests(incomingRequests.filter(req => req !== fromUsername));
            } else {
                console.error('Error rejecting request:', data.message);
            }
        } catch (err) {
            console.error('Error rejecting friend request:', err);
        }
    };

    
    return(
        <div className="friend_req_bar">
        <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        <button 
            onClick={handleSendFriendRequest}
            disabled={!username}
            style={{
                backgroundColor: username ? '#007bff' : 'var(--surface)',
                color: username ? 'white' : 'var(--text)'
            }}
        >
          Send Friend Request
        </button>

        <div style={{ marginTop: '20px' }}>
          <h3>Incoming Friend Requests</h3>
          {incomingRequests.length > 0 ? (
            <div>
              {incomingRequests.map((request, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: '8px'
                }}>
                  <span style={{ textAlign: 'left' }}>{request}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleAcceptRequest(request)}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => handleRejectRequest(request)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No incoming requests</p>
          )}
        </div>
        </div>
    )
    
}
export default FriendRequest;