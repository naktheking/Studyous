import { useState } from 'react';
import './App.css';
import Post from './post';
import Login from './login';
import FriendRequest from './friends';
import PostHistory from './history'
import PostStats from './stats'
import FriendsFeed from './FriendsFeed'

function App() {
  const [username, setUsername] = useState('');  //only for login/signup form
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');  //for when they are already logged in
  const [post, setPost] = useState(false);
  const [history, setHistory] = useState(false);
  const [stats, setStats] = useState(false);
  const [friendPanelOpen, setFriendPanelOpen] = useState(false);

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
          <div className="content-row">
            <div className={`post-column${friendPanelOpen ? ' post-column--shifted' : ''}`}>
              {post && <Post post={post} setPost={setPost} person={loggedInUser} />}
              {!post && <FriendsFeed loggedInUser={loggedInUser} />}
            </div>
            <FriendRequest loggedInUser={loggedInUser} isOpen={friendPanelOpen} setIsOpen={setFriendPanelOpen} />
          </div>
          <div className="center-panels">
            <PostStats stats={stats} setStats={setStats} username={loggedInUser} />
            <PostHistory history={history} setHistory={setHistory} username={loggedInUser} />
          </div>
          <div className="bottom-bar">
            {!post && (
              <button className="create-post-button" onClick={() => setPost(true)}>Create Post</button>
            )}
            <button className="stats-button" onClick={() => setHistory(!history)}>
              {history ? 'Hide Post History' : 'View Post History'}
            </button>
            <button className="stats-button" onClick={() => setStats(!stats)}>
              {stats ? 'Hide Post Stats' : 'View Post Stats'}
            </button>
          </div>
        </>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} setLoggedInUser={setLoggedInUser} setUsername={setUsername} username={username} />
      )}
    </div>
  );
}

export default App;
