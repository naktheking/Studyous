import { useState, useEffect } from 'react';
import { convertToTwelveHour } from './utils/timeUtils.js';

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
        {/* Times stored in military format but displayed in 12-hour format */}
        <p>{convertToTwelveHour(post.startTime)} - {convertToTwelveHour(post.endTime)}</p>
      </div>
      ))}
      </div>
    )}
    </div>
  )

}
export default PostHistory;