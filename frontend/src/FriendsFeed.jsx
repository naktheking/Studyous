import { useState, useEffect } from 'react';
import { convertToTwelveHour } from './utils/timeUtils.js';

const EMOJIS = ['👍', '❤️', '😂', '😮', '🔥', '😢'];

function FriendsFeed({ loggedInUser }) {
  const [feedPosts, setFeedPosts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [commentOpen, setCommentOpen] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});
  const [profilePics, setProfilePics] = useState({});

  useEffect(() => {
    if (!loggedInUser) return;

    //Feeds
    const fetchFeed = async () => {
      try {
        setFeedPosts([]);

        const friendsRes = await fetch(`http://localhost:3000/friend/get-friends/${loggedInUser}`);
        const friendsData = await friendsRes.json();

        //no friend or friends have no post
        if (!friendsData.success || friendsData.friends.length === 0) {
          setFeedPosts([]);
          return;
        }

        // Fetch one friend's posts and tag each post with its author.
        // Returns [] if the request fails or the response isn't a post array.
        const fetchPostsForFriend = async (friend) => {
          try {
            const res = await fetch(`http://localhost:3000/post/get-post?username=${friend}`);
            const posts = await res.json();

            if (!Array.isArray(posts)) return [];

            return posts.map(post => ({ ...post, author: friend })); //...post is each post in the array
          } catch {
            return [];
          }
        };

        const postPromises = friendsData.friends.map(fetchPostsForFriend);

        //sorts all post in descending order. Newest posts first
        const allPostArrays = await Promise.all(postPromises);
        const allPosts = allPostArrays.flat();
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFeedPosts(allPosts);

        //profile pictures for corresponding posts
        const picPromises = friendsData.friends.map(friend =>
          fetch(`http://localhost:3000/account/get-account?username=${friend}`)
            .then(res => res.json())
            .then(data => ({ [friend]: data.profilePic || '' })) //If there's no profile pic, then set to default
            .catch(() => ({ [friend]: '' }))
        );
        const picResults = await Promise.all(picPromises);
        const pics = Object.assign({}, ...picResults);
        setProfilePics(pics);
      } catch (err) {
        console.error('Error fetching feed:', err);
      }
    };
    fetchFeed();
  }, [loggedInUser, refreshKey]);


  //Reactions
  const toggleReaction = async (post, emoji) => {
    try {
      // Tell the backend this user tapped an emoji on this post
      const res = await fetch(`http://localhost:3000/post/react/${post.author}/${post._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loggedInUser, emoji }),
      });
      const data = await res.json();

      //No reaction
      if (data.reactions === undefined) return;

      // Swap in the updated reactions on the post we reacted to, leaving the rest untouched
      const updatePost = (p) => {
        const isTargetPost = p._id === post._id && p.author === post.author;
        return isTargetPost ? { ...p, reactions: data.reactions } : p;
      };
      setFeedPosts(prev => prev.map(updatePost));
    } catch (err) {
      console.error('Error reacting:', err);
    }
  };

  //Creating a Comment
  const submitComment = async (post) => {
    //Comments can't be a blank or whitespace-only
    const text = (commentInputs[post._id] || '').trim();
    if (!text) return;

    try {
      const res = await fetch(`http://localhost:3000/post/comment/${post.author}/${post._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loggedInUser, text }),
      });
      const data = await res.json();

      //No comment
      if (data.comments === undefined) return;

      const updatePost = (p) => {
        const isTargetPost = p._id === post._id && p.author === post.author;
        return isTargetPost ? { ...p, comments: data.comments } : p;
      };
      setFeedPosts(prev => prev.map(updatePost));

      // Clear this post's comment input box
      setCommentInputs(prev => ({ ...prev, [post._id]: '' }));
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };

  //Deleting a comment
  const deleteComment = async (post, commentId) => {
    try {
      const res = await fetch(`http://localhost:3000/post/comment/${post.author}/${post._id}/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loggedInUser }),
      });
      const data = await res.json();

      //No comment
      if (data.comments === undefined) return;

      const updatePost = (p) => {
        const isTargetPost = p._id === post._id && p.author === post.author; //only allows comment's author to delete comment
        return isTargetPost ? { ...p, comments: data.comments } : p;
      };
      setFeedPosts(prev => prev.map(updatePost));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const toggleComments = (postId) => {
    setCommentOpen(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };


  const getReactionSummary = (reactions = []) => {
    const counts = {};
    reactions.forEach(reaction => {
      const emoji = reaction.emoji;
      counts[emoji] = (counts[emoji] || 0) + 1;
    });
    return counts;
  };

  const getMyReaction = (reactions = []) =>
    reactions.find(r => r.username === loggedInUser)?.emoji || null;

  return (
    <div className="friends-feed">
      <div className="feed-header">
        <span className="feed-title">Friends' Posts</span>
        <button className="refresh-button" onClick={() => setRefreshKey(k => k + 1)} title="Refresh feed">↻</button>
      </div>

      {/* If feed is empty */}
      {feedPosts.length === 0 ? (
        <p className="friends-feed-empty">No posts from friends yet.</p>
      ) : 
      //if feed is not empty
      (
        feedPosts.map(post => {
          const reactions = post.reactions || [];
          const comments = post.comments || [];
          const reactionSummary = getReactionSummary(reactions);
          const myReaction = getMyReaction(reactions);
          const isOpen = commentOpen.has(post._id);

        return (
          <div key={post._id} className="feed-post">
            <div className="feed-post-author-row">
              <img
                src={profilePics[post.author] || '/default-avatar.png'}
                alt={post.author}
                className="profile-pic-small"
              />
              <span className="feed-post-author">{post.author}</span>
            </div>
              <h4 className="feed-post-title">{post.title}</h4>
              {post.image && <img src={post.image} alt="post" className="post-image" style={{ width: '100px', height: '100px', objectFit: 'cover', display: 'block', margin: '0 auto'}} />}
              <p className="feed-post-detail">{post.location}</p>
              <p className="feed-post-detail">{post.date}</p>
              {/* Times stored in military format but displayed in 12-hour format */}
              <p className="feed-post-detail">{convertToTwelveHour(post.startTime)} – {convertToTwelveHour(post.endTime)}</p>

              <div className="reaction-bar">
                <div className="emoji-buttons">
                  {EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      className={`emoji-btn${myReaction === emoji ? ' emoji-btn--active' : ''}`}
                      onClick={() => toggleReaction(post, emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {Object.keys(reactionSummary).length > 0 && (
                  <div className="reaction-summary">
                    {Object.entries(reactionSummary).map(([emoji, count]) => (
                      <span key={emoji} className="reaction-chip">{emoji} {count}</span>
                    ))}
                  </div>
                )}
              </div>

              <button className="comments-toggle" onClick={() => toggleComments(post._id)}>
                {isOpen ? 'Hide comments' : `Comments${comments.length > 0 ? ` (${comments.length})` : ''}`}
              </button>

              {isOpen && (
                <div className="comments-section">
                  {comments.length === 0 && <p className="no-comments">No comments yet.</p>}
                  {comments.map(comment => (
                    <div key={comment._id} className="comment-item">
                      <span className="comment-author">{comment.username}</span>
                      <span className="comment-text">{comment.text}</span>
                      {comment.username === loggedInUser && (
                        <button className="comment-delete" onClick={() => deleteComment(post, comment._id)}>×</button>
                      )}
                    </div>
                  ))}
                  <div className="comment-input-row">
                    <input
                      className="comment-input"
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post._id] || ''}
                      onChange={e => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') submitComment(post); }}
                    />
                    <button className="comment-submit" onClick={() => submitComment(post)}>Post</button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default FriendsFeed;
