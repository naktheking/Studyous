import { useState } from 'react';
import './App.css';
import Post from './post';
import Login from './login';
import FriendRequest from './friends';
import PostStats from './statistics'
function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
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
        <>
          {post && <Post setPost={setPost} person={loggedInUser} />}
          <PostStats stats={stats} person={loggedInUser} />
          <FriendRequest person={loggedInUser} />
          {!post && (
            <div className="bottom-bar">
              <button className="post-button" onClick={() => setPost(true)}>Make Post</button>
              <button className="stats-button" onClick={() => setStats(!stats)}>
                {stats ? 'Hide Post History' : 'View Post History'}
              </button>
            </div>
          )}
        </>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} setLoggedInUser={setLoggedInUser} setUsername={setUsername} username={username} />
      )}
    </div>
  );
}

export default App;