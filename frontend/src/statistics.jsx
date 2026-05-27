import { useState, useEffect } from 'react';

function PostStats({ stats, person }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (stats && person) {
      fetchPosts();
    }
  }, [stats, person]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/statistics/get-post/${person}`
      );
      const postData = await res.json();
      setPosts(postData);
    } catch (err) {
        console.error(err);
    }
  };

  if (!stats) return null;

  return (
    <div className="post_info">
      {posts.map((p) => (
        <div key={p._id}>
          <h4>{p.title}</h4>
          <p>{p.location}</p>
          <p>{p.date}</p>
          <p>{p.startTime} - {p.endTime}</p>
        </div>
      ))}
    </div>
  );
}

export default PostStats;
