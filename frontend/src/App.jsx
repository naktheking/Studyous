import { useState } from 'react';
import './App.css';
import Post from './post';
import Login from './login';
import FriendRequest from './friends';
import PostStats from './statistics'
function App() {
  const [username, setUsername] = useState('');  //only for login/signup form
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');  //for when they are already logged in
  const [post, setPost] = useState(false);
  const [stats, setStats] = useState(false);

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
            <Post post={post} setPost={setPost} userName={loggedInUser} />
          </div>
          <FriendRequest loggedInUser={loggedInUser} />
          <div className="stats-column">
            <button className="stats-button" onClick={() => setStats(!stats)}>
              {stats ? 'Hide Post History' : 'View Post History'}
            </button>
            <PostStats stats={stats} person={loggedInUser} />
          </div>
        </div>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} setLoggedInUser={setLoggedInUser} setUsername={setUsername} username={username} />
      )}
    </div>
  );
}

export default App;
