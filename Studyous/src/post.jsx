import { useState, useEffect } from 'react';

function Post({post, setPost}){
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState('');
    const [complete, setComplete] = useState(false);
    
    useEffect(() => {
        setComplete(title && location && startTime && endTime && date);
    }, [title, location, startTime, endTime, date]);
    return (
        <div className="logged-in-container">
        {post ? (
            <form className="post-form">
              <h2>Create a Post</h2>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <button type="button" onClick={() => setPost(false)}>Cancel</button>
              <button type={complete ? "submit" : "button"} onClick={(e) => {
                e.preventDefault();
                // Handle post submission   
              }}>Submit Post</button>
            </form>
          ) : (
            <button className="post-button" onClick={() => setPost(true)}>post</button>
          )}
        </div>
    );
}

export default Post;