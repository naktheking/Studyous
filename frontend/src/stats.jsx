import { useState, useEffect } from 'react';

function PostStats({ stats, setStats, username }) {
  const [posts, setPosts] = useState('');

  const fetchPosts = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:3000/stats/get-posts?username=${username}`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
      const userData = await response.json();
      setPosts(userData.posts);
      setStats(true);
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="post_info">
    { stats ? (
      <div>
        <button type="button" onClick={() => setStats(false)}>Hide Post Stats</button>
      </div>
    ) : (
      <button className="stats-button" onClick={fetchPosts}>View Post Stats</button>
    )}
    </div>
  )

}
export default PostStats;