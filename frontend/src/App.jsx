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
  const [profilePic, setProfilePic] = useState('');

  return (
    <div className="App">
      <div className="header">
        <h1>Studyous</h1>
        {isLoggedIn && (
  <div className="user-section">
    <div className="profile-pic-wrapper">
      <label htmlFor="pic-upload" style={{ cursor: 'pointer' }}>
        <img
          src={profilePic || '/default-avatar.png'}
          alt="profile"
          className="profile-pic"
        />
      </label>
      <input
        id="pic-upload"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const formData = new FormData();
          formData.append('profilePic', file);
          const res = await fetch(`http://localhost:3000/account/upload-pic/${loggedInUser}`, {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.profilePic) setProfilePic(data.profilePic);
        }}
      />
    </div>
    <div className="username-display">{loggedInUser}</div>
    <button className="logout-button" onClick={() => {
      setIsLoggedIn(false);
      setLoggedInUser('');
      setProfilePic('');
    }}>Logout</button>
  </div>
)}
      </div>
      {isLoggedIn ? (
        <>
          <div className="content-row">
            <div className={`post-column${friendPanelOpen ? ' post-column--shifted' : ''}`}>
              {post && <Post post={post} setPost={setPost} person={loggedInUser} />}
              {!post && !history && !stats && <FriendsFeed loggedInUser={loggedInUser} />}
            </div>
            <FriendRequest loggedInUser={loggedInUser} isOpen={friendPanelOpen} setIsOpen={setFriendPanelOpen} />
          </div>
          <div className="center-panels">
            <PostStats stats={stats} setStats={setStats} username={loggedInUser} />
            <PostHistory history={history} setHistory={setHistory} username={loggedInUser} />
          </div>
          <div className="bottom-bar">
            <button className="create-post-button" onClick={() => { setPost(!post); setHistory(false); setStats(false); }}>
              {post ? 'Hide Create Post' : 'Create Post'}
            </button>
            <button className="stats-button" onClick={() => { setHistory(!history); setPost(false); setStats(false); }}>
              {history ? 'Hide Post History' : 'View Post History'}
            </button>
            <button className="stats-button" onClick={() => { setStats(!stats); setPost(false); setHistory(false); }}>
              {stats ? 'Hide Post Stats' : 'View Post Stats'}
            </button>
          </div>
        </>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} setLoggedInUser={setLoggedInUser} setUsername={setUsername} username={username} setProfilePic={setProfilePic} />
      )}
    </div>
  );
}

export default App;
