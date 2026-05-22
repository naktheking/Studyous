import { useState, useEffect } from 'react';

function FriendRequest()
{
    const [username, setUsername] = useState('');
    const [sendRequest, setSendRequest] = useState(false);

    useEffect(() => {
        // Button highlights when username is not empty
    }, [username]);

    return(
        <div className="friend_req_bar">
        <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        <button 
            onClick={() => setSendRequest(true)} 
            disabled={!username}
            style={{
                backgroundColor: username ? '#007bff' : 'var(--surface)',
                color: username ? 'white' : 'var(--text)'
            }}
        >
          Send Friend Request
        </button>
        </div>
    )
    
}
export default FriendRequest;