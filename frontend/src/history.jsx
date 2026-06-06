import { useState, useEffect } from 'react';
import { convertToTwelveHour } from './utils/timeUtils.js';
import usePosts from './utils/usePosts.js';

function PostHistory({ history, setHistory, username }) {
  const posts = usePosts('http://localhost:3000/history/get-posts', history, username);
  const EMOJIS = ['👍', '❤️', '😂', '😮', '🔥', '😢'];

  // Total up amount of each reaction
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
        {/* Post content */} 
        <h4>{post.title}</h4>
        {post.image && <img src={post.image} style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block', margin: '0 auto'}}/>}
        <p>{post.location}</p>
        <p>{post.date}</p>
        {/* Times stored in military format but displayed in 12-hour format */}
        <p>{convertToTwelveHour(post.startTime)} - {convertToTwelveHour(post.endTime)}</p>       {/*This line was written by AI refer to prompt 2.*/}
          {/* If reactions exist, show section with reaction counter */} 
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
          {/* If comments exist, display them below the post */} 
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
