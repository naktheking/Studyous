import { useState, useEffect } from 'react';

function Post({post, setPost, userName}){
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState('');
    const [complete, setComplete] = useState(false);
    
    useEffect(() => {
        setComplete(location && startTime && endTime && date);
    }, [location, startTime, endTime, date]);

    const handlePost = async (e) => {
        e.preventDefault();
        console.log('handlePost triggered');
        console.log('Sending post with:', { person: userName, location, startTime, endTime, date });

        try {
           console.log('Fetching to backend...');
           const response = await fetch('http://localhost:3000/post/create-post', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ person: userName, location, startTime, endTime, date })
          }); //hi

          console.log('Got response:', response);
          const data = await response.json();

          if (response.ok) {
            console.log('Post created:', data);
            setLocation('');
            setStartTime('');
            setEndTime('');
            setDate('');
            setPost(false);
          } else {
            console.error('Error:', data.error);
          }
        }
        catch (err) {
          console.error('Error: ' + err.message);
        }
        setPost(false);

    };

    return (
        <div className="logged-in-container">
        {post ? (
            <form className="post-form" onSubmit={handlePost}>
              <h2>Create a Post</h2>
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
                <button type={complete ? "submit" : "button"} onClick={handlePost}>Submit Post</button>
            </form>
          ) : (
            <button className="post-button" onClick={() => setPost(true)}>post</button>
          )}
        </div>
    );
}

export default Post;