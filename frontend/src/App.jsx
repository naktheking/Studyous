import { useState } from 'react';
import './App.css';
import Post from './post';
import Login from './login';
import FriendRequest from './friends';
function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [post, setPost] = useState(false);

  return (
    <div className="App">
      <div className="header">
        <h1>Studyous</h1>
        {isLoggedIn && (
          <div className="user-section">
            <div className="username-display">{loggedInUser}</div>
            <button className="logout-button" onClick={() => {
              setIsLoggedIn(false);
              setLoggedInUser('');
            }}>Logout</button>
          </div>
        )}
      </div>
      
      {isLoggedIn ? (
        <div className="content-row">
          <div className="post-column">
            <Post post={post} setPost={setPost} userName={username} />
          </div>
          <FriendRequest loggedInUser={loggedInUser} />
        </div>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} setLoggedInUser={setLoggedInUser} setUsername={setUsername} username={username} />
      )}
    </div>
  );
}

export default App;