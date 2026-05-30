import { useState, useEffect } from 'react';

function PostHistory({ history, setHistory, username }) {
  const [posts, setPosts] = useState('');

  const fetchPosts = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:3000/history/get-posts?username=${username}`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
      const userData = await response.json();
      setPosts(userData.posts);
      setHistory(true);
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="post_info">
    { history ? (
      <div>
        <button type="button" onClick={() => setHistory(false)}>Hide Post History</button>
      {posts.map((post) => (
      <div key={post._id} className="post">
        <h4>{post.title}</h4>
        <p>{post.location}</p>
        <p>{post.date}</p>
        <p>{post.startTime} - {post.endTime}</p>
      </div>
      ))}
      </div>
    ) : (
      <button className="history-button" onClick={fetchPosts}>View Post History</button>
    )}
    </div>
  )

}
export default PostHistory;