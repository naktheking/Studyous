import { useState, useEffect } from 'react';

function FriendsFeed({ loggedInUser }) {
  const [feedPosts, setFeedPosts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!loggedInUser) return;

    const fetchFeed = async () => {
      try {
        const friendsRes = await fetch(`http://localhost:3000/friend/get-friends/${loggedInUser}`);
        const friendsData = await friendsRes.json();

        if (!friendsData.success || friendsData.friends.length === 0) {
          setFeedPosts([]);
          return;
        }

        const postPromises = friendsData.friends.map(friend =>
          fetch(`http://localhost:3000/post/get-post?username=${friend}`)
            .then(res => res.json())
            .then(posts => (Array.isArray(posts) ? posts : []).map(post => ({ ...post, author: friend })))
            .catch(() => [])
        );

        const allPostArrays = await Promise.all(postPromises);
        const allPosts = allPostArrays.flat();
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFeedPosts(allPosts);
      } catch (err) {
        console.error('Error fetching feed:', err);
      }
    };

    fetchFeed();
  }, [loggedInUser, refreshKey]);

  return (
    <div className="friends-feed">
      <div className="feed-header">
        <span className="feed-title">Friends' Posts</span>
        <button className="refresh-button" onClick={() => setRefreshKey(k => k + 1)} title="Refresh feed">↻</button>
      </div>
      {feedPosts.length === 0 ? (
        <p className="friends-feed-empty">No posts from friends yet.</p>
      ) : (
        feedPosts.map(post => (
          <div key={post._id} className="feed-post">
            <div className="feed-post-author">{post.author}</div>
            <h4 className="feed-post-title">{post.title}</h4>
            <p className="feed-post-detail">{post.location}</p>
            <p className="feed-post-detail">{post.date}</p>
            <p className="feed-post-detail">{post.startTime} – {post.endTime}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default FriendsFeed;
