import { useState, useEffect } from 'react';

function PostStats({ stats, setStats, username }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async (e) => {
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
    if (stats) {
      fetchPosts();
    }
  }, [username, stats]);

  function getTime(posts) {
    const startTimes = [];
    const endTimes = [];
    let hours = 0;
    let minutes = 0;

    for (let i = 0; i < posts.length; i++) {
      startTimes.push(posts[i].startTime);
      endTimes.push(posts[i].endTime);
    }

    // Parse military time format (HH:mm) and calculate total study time
    // Times are already in 24-hour format (e.g., "14:30" = 2:30 PM)
    for (let j = 0; j < startTimes.length; j++) {
      let startMins = (parseInt(startTimes[j].slice(0, 2)) * 60) + parseInt(startTimes[j].slice(3, 5));
      let endMins = (parseInt(endTimes[j].slice(0, 2)) * 60) + parseInt(endTimes[j].slice(3, 5));

      minutes += endMins - startMins;
    }

    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    const out = "Overall time studied: " + hours + " hours, " + minutes + " minutes";
    return out;
  }

  return (
    <div className="post_info">
    { stats && ( 
      <div>
        <p>Total posts: {posts.length}</p>
        <p>{getTime(posts)}</p>
      </div>
    )}
    </div>
  )

}
export default PostStats;