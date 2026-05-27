import { useState, useEffect } from 'react';

function FriendRequest({ person }) {
    const [username, setUsername] = useState('');
    const [sendRequest, setSendRequest] = useState(false);
    const [posts, setPosts] = useState([]);

    const fetchAllPosts = async () => {
        try {
            const res = await fetch('http://localhost:3000/post/get-post');
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAllPosts();
    }, []);

    const handleLike = async (postId) => {
        try {
            const res = await fetch(`http://localhost:3000/post/like-post/${postId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: person })
            });
            const data = await res.json();

            // update just that post's likes in state
            setPosts(prev =>
                prev.map(p => p._id === postId ? { ...p, likes: data.likes } : p)
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="friend_req_bar">
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button
                onClick={() => setSendRequest(true)}
                disabled={!username}
                style={{
                    backgroundColor: username ? '#007bff' : 'var(--surface)',
                    color: username ? 'white' : 'var(--text)'
                }}
            >
                Send Friend Request
            </button>

            <div className="post-feed">
                <h3>Study Sessions</h3>
                {posts.length === 0 ? (
                    <p>No posts yet!</p>
                ) : (
                    posts.map((p) => (
                        <div key={p._id} className="post-card">
                            <h4>{p.title}</h4>
                            <p>{p.person}</p>
                            <p>{p.location}</p>
                            <p>{p.date} — {p.startTime} to {p.endTime}</p>
                            <button onClick={() => handleLike(p._id)}>
                                {p.likes?.includes(person) ? '❤️' : '🤍'} {p.likes?.length || 0}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default FriendRequest;