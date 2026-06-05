import { useState, useEffect } from 'react';
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
  const [historyOpen, setHistoryOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [friendPanelOpen, setFriendPanelOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(''); //string for location of the profile picture

  // after authenticating through Google OAuth, logs the user in, then cleans up the URL of the picture URL
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const user = params.get('user');
  const pic = params.get('pic');
  if (user) {
    setLoggedInUser(user);
    setIsLoggedIn(true);
    if (pic) setProfilePic(decodeURIComponent(pic));
    window.history.replaceState({}, '', '/');  // removes query params from the URL
  }
}, []);

  return (
    <div className="App"> 
      <div className="header">
        <h1>Studyous</h1>
        {isLoggedIn && (
  <div className="user-section">
    <div className="profile-pic-wrapper">
      {/* Clicking the image opens the hidden file input */}
      <label htmlFor="pic-upload" style={{ cursor: 'pointer' }}>
        <img
          src={profilePic || '/default-avatar.png'} //falls to default-avatar.png if no photo selected
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
          const formData = new FormData(); //required for file upload
          formData.append('profilePic', file);
          const res = await fetch(`http://localhost:3000/account/upload-pic/${loggedInUser}`, {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          // Updates state so the new pic shows immediately without a refresh
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
              {!post && !historyOpen && !statsOpen && <FriendsFeed loggedInUser={loggedInUser} />}
            </div>
            <FriendRequest loggedInUser={loggedInUser} isOpen={friendPanelOpen} setIsOpen={setFriendPanelOpen} />
          </div>
          <div className="center-panels">
            <PostStats stats={statsOpen} setStats={setStatsOpen} username={loggedInUser} />
            <PostHistory history={historyOpen} setHistory={setHistoryOpen} username={loggedInUser} />
          </div>
          <div className="bottom-bar">
            <button className="create-post-button" onClick={() => { setPost(!post); setHistoryOpen(false); setStatsOpen(false); }}>
              {post ? 'Hide Create Post' : 'Create Post'}
            </button>
            <div className="bottom-bar-row">
              <button className="stats-button" onClick={() => { setHistoryOpen(!historyOpen); setPost(false); setStatsOpen(false); }}>
                {historyOpen ? 'Hide Post History' : 'View Post History'}
              </button>
              <button className="stats-button" onClick={() => { setStatsOpen(!statsOpen); setPost(false); setHistoryOpen(false); }}>
                {statsOpen ? 'Hide Post Stats' : 'View Post Stats'}
              </button>
            </div>
          </div>
        </>
      ) : (
        //if user isn't logged in, show log in page
        <Login setIsLoggedIn={setIsLoggedIn} setLoggedInUser={setLoggedInUser} setUsername={setUsername} username={username} setProfilePic={setProfilePic} />
      )}
    </div>
  );
}

export default App;
