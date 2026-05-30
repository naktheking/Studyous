import { useState, useEffect } from 'react';

function PostHistory({ history, setHistory, username }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async (e) => {
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
    if (history) {
      fetchPosts();
    }
  }, [username, history]);

  return (
    <div className="post_info">
    { history && (
      <div>
      {posts.map((post) => (
      <div key={post._id} className="post">
        <h4>{post.title}</h4>
        <p>{post.location}</p>
        <p>{post.date}</p>
        <p>{post.startTime} - {post.endTime}</p>
      </div>
      ))}
      </div>
    )}
    </div>
  )

}
export default PostHistory;