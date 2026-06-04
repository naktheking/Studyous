import { useState, useEffect } from 'react';
import { convertToTwelveHour } from './utils/timeUtils.js';

function PostHistory({ history, setHistory, username }) {
  const [posts, setPosts] = useState([]);

  const EMOJIS = ['👍', '❤️', '😂', '😮', '🔥', '😢'];

  useEffect(() => {
    const fetchPosts = async (e) => {
      try {
        const response = await fetch(`http://localhost:3000/history/get-posts?username=${username}`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
        const userData = await response.json();
        setPosts(userData.posts);
      } catch (err) {
          console.error(err);
      }
    };
    if (history) {
      fetchPosts();
    }
  }, [username, history]);

  const getReactionSummary = (reactions = []) => {
    const counts = {};
    reactions.forEach(r => { counts[r.emoji] = (counts[r.emoji] || 0) + 1; });
    return counts;
  };

  return (
    <div className="post_info post_info--scrollable">
    { history && (
      <div>
      {posts.map((post) => (
      <div key={post._id} className="post">
        <h4>{post.title}</h4>
        <p>{post.location}</p>
        <p>{post.date}</p>
        {/* Times stored in military format but displayed in 12-hour format */}
        <p>{convertToTwelveHour(post.startTime)} - {convertToTwelveHour(post.endTime)}</p>       {/*This line was written by AI refer to prompt 2.*/}

          {Object.keys(getReactionSummary(post.reactions)).length > 0 && (
            <div className="reaction-bar">
              <div className="reaction-summary">
                {Object.entries(getReactionSummary(post.reactions)).map(([emoji, count]) => (
                  <span key={emoji} className="reaction-chip">{emoji} {count}</span>
                ))}
              </div>
          </div>
          )}

        <div className="comments-section">
          {post.comments.length === 0 && <p className="no-comments">No comments yet.</p>}
          {post.comments.map(comment => (
            <div key={comment._id} className="comment-item">
              <span className="comment-author">{comment.username}</span>
              <span className="comment-text">{comment.text}</span>
              {comment.username === username && (
                <button className="comment-delete" onClick={() => deleteComment(post, comment._id)}>×</button>
              )}
            </div>
          ))}
        </div>
      </div>
      ))}
      </div>
    )}
    </div>
  )

}
export default PostHistory;
