import { useState } from 'react';
import './App.css';
import Post from './post';
import Login from './login';
import FriendRequest from './friends';
import PostHistory from './history'
import PostStats from './stats'

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [post, setPost] = useState(false);
  const [history, setHistory] = useState(false);
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
          <Post post={post} setPost={setPost} person={loggedInUser} />
          <FriendRequest />
          <PostHistory history={history} setHistory={setHistory} username={loggedInUser} />
          <PostStats stats={stats} setStats={setStats} username={loggedInUser} />
        </>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} setLoggedInUser={setLoggedInUser} setUsername={setUsername} username={username} />
      )}
    </div>
  );
}

export default App;