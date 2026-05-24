import { useState, useEffect } from 'react';

function PostStats({ stats, setStats, person }) {
  const [posts, setPosts] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/statistics/get-post/${person}`
      );

      const postData = await res.json();
      setPosts(postData);
      setStats(true);
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="post_info">
    { stats ? (
      <div>
        <button type="button" onClick={() => setStats(false)}>Hide Post History</button>
      {posts.map((p) => (
        <div key={p._id}>
          <h4>{p.title}</h4>
          <p>{p.location}</p>
          <p>{p.date}</p>
          <p>{p.startTime} - {p.endTime}</p>
        </div>
        ))}
      </div>
    ) : (
      <button className="stats-button" onClick={fetchPosts}>View Post History</button>
    )}
    </div>
  )

}
export default PostStats;