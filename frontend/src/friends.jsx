import { useState, useEffect } from 'react';

function FriendRequest({ loggedInUser, isOpen, setIsOpen })
{
    const [username, setUsername] = useState('');
    const [sendRequest, setSendRequest] = useState(false);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [requestMessage, setRequestMessage] = useState('');

    useEffect(() => {
        // Fetch incoming friend requests and friend list when user logs in
        if (loggedInUser) {
            fetchIncomingRequests();
            fetchFriends();
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

    const fetchFriends = async () => {
        try {
            const response = await fetch(`http://localhost:3000/friend/get-friends/${loggedInUser}`);
            const data = await response.json();

            if (data.success) {
                setFriends(data.friends);
            } else {
                console.error('Error fetching friends:', data.message);
            }
        } catch (err) {
            console.error('Error fetching friends:', err);
        }
    };

    const handleSendFriendRequest = async () => {
        try {
            if (friends.includes(username)) {
                setRequestMessage(`${username} is already your friend.`);
                setUsername('');
                return;
            }

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
                setRequestMessage(`Friend request sent to ${username}!`);
                setUsername('');
                setSendRequest(false);
            } else {
                setRequestMessage(data.message || 'Failed to send friend request.');
            }
        } catch (err) {
            console.error('Error sending friend request:', err);
            setRequestMessage('Error sending friend request.');
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
                setFriends((prev) => [...prev, fromUsername]);
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
                <div className="friend-panel">
                    <button
                        className={`heart-button friend-toggle ${isOpen ? 'is-active' : ''}`}
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-label="Toggle friends panel"
                        title="Toggle friends panel"
                        type="button"
                    >
                        ♥
                    </button>
                    {isOpen && (
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
                                Send
                            </button>

                            {requestMessage && (
                                <p style={{ fontSize: '13px', marginTop: '6px', color: requestMessage.includes('sent to') ? '#28a745' : '#dc3545' }}> 
                                    {requestMessage}
                                </p>
                            )}

                            <div style={{ marginTop: '20px' }}>
                                <h3 className="incoming-requests-title">Incoming Friend Requests</h3>             
                                {incomingRequests.length > 0 ? (
                                    <div>
                                        <div className="incoming-request-item">                                      
                                            <span className="incoming-request-name">{incomingRequests[0]}</span>       
                                            <div className="incoming-request-actions">
                                                <button 
                                                    onClick={() => handleAcceptRequest(incomingRequests[0])}
                                                    style={{
                                                        backgroundColor: '#28a745',                        //this button styling was wrtting by AI
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
                                                    onClick={() => handleRejectRequest(incomingRequests[0])}        //this button was styling wrtitten by AI
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
                                    </div>
                                ) : (
                                    <p>No incoming requests</p>
                                )}
                            </div>
                            <div className="friend-list-panel">
                                <h3 className="incoming-requests-title">Friends</h3>
                                {friends.length > 0 ? (
                                    <ul className="friend-list">
                                        {friends.map((friend) => (
                                            <li key={friend} className="friend-list-item">{friend}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No friends yet</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
        )
    
}

export default FriendRequest;