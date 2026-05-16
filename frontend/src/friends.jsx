import { useState, useEffect } from 'react';

function FriendRequest()
{
    const [username, setUsername] = useState('');
    const [sendRequest, setSendRequest] = useState(false);
    return(
        <div className="friend_req_bar">
        <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        <button onClick={() => setSendRequest(true)} disabled={!username}>
          Send Friend Request
        </button>
        </div>
    )
    
}
export default FriendRequest;