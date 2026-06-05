import { useState, useEffect } from 'react';

function PostStats({ stats, setStats, username }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      // Request posts of logged-in user from server
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
    if (stats) { // Only request posts once stats is actually opened
      fetchPosts();
    }
  }, [username, stats]);

  function getTime(posts) {
    const startTimes = [];
    const endTimes = [];
    const dates = [];
    let hours = 0;
    let minutes = 0;
    const now = new Date();

    // Get current week start (Monday)
    const currentDay = now.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Monday is 0
    const weekStart = new Date(now);
    console.log(daysFromMonday);
    weekStart.setDate(now.getDate() - daysFromMonday);
    weekStart.setHours(0, 0, 0, 0);

    for (let i = 0; i < posts.length; i++) {
      startTimes.push(posts[i].startTime);
      endTimes.push(posts[i].endTime);
      dates.push(posts[i].date);
    }

    // Parse military time format (HH:mm) and calculate total study time for this week
    // Only count posts where the end time has already passed and the post is from this week
    for (let j = 0; j < startTimes.length; j++) {
      // Create a date object from the post's date and end time
      const postEndDateTime = new Date(`${dates[j]} ${endTimes[j]}`);
      const postDate = new Date(dates[j] + "T00:00:00"); // makes it so it is LOCAL time.
      postDate.setHours(0, 0, 0, 0);
      
      // Only count this post if it has already ended AND is from this week
      if (postEndDateTime <= now && postDate >= weekStart) {
        let startMins = (parseInt(startTimes[j].slice(0, 2)) * 60) + parseInt(startTimes[j].slice(3, 5));
        let endMins = (parseInt(endTimes[j].slice(0, 2)) * 60) + parseInt(endTimes[j].slice(3, 5));

        minutes += endMins - startMins;
      }
    }

    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    const out = "Overall time studied: " + hours + " hours, " + minutes + " minutes";
    return out;
  }

  function getWeeklyStreak(posts) {
    // Get current date and calculate start of current week (Monday)
    const today = new Date();
    const currentDay = today.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Monday is 0
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - daysFromMonday);
    weekStart.setHours(0, 0, 0, 0);

    // Get unique days studied this week
    const studyDaysThisWeek = new Set();
    posts.forEach(post => {
      const postDate = new Date(post.date + "T00:00:00"); // again makes it so it is LA time.
      postDate.setHours(0, 0, 0, 0);
     
      if (postDate >= weekStart && postDate <= today) {
        studyDaysThisWeek.add(post.date);
        
      } 
    });

    return studyDaysThisWeek.size;
  }

  function getLocation(posts) {
    const locations = new Map();
    console.log(locations);
    
    // Store each location and number of times listed in Map object
    posts.forEach(post => {
      console.log(post.location);
      if (locations.has(post.location)) {
        locations.set(post.location, locations.get(post.location) + 1);
      }
      else {
        locations.set(post.location, 1);
      }
    });

    // Determine most-listed location
    let out = "--";
    let max = 0;
    for (const [location, value] of locations) {
      console.log(location);
      if (value > max) {
        max = value;
        out = location;
      }
    }

    return out;
  }

  return (
    <div className="post_info">
    { stats && ( 
      <div className="stats-container">
        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <p className="stat-label">Total Study Sessions</p>
              <p className="stat-value">{posts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <p className="stat-label">Time Studied This Week</p>
              <p className="stat-value">{getTime(posts).replace("Overall time studied: ", "")}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-icon">📍</div>
            <div className="stat-content">
              <p className="stat-label">Top Location</p>
              <p className="stat-value">{getLocation(posts)}</p>
            </div>
          </div>
        </div>

        {posts.length > 0 && (
          <div className="stats-progress">
            <div className="progress-item">
              <span className="progress-label">Weekly Streak</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${(getWeeklyStreak(posts) / 7) * 100}%`}}></div>
              </div>
              <span className="progress-value">{getWeeklyStreak(posts)} out of 7 days this week</span>
            </div>
          </div>
        )}
      </div>
    )}
    </div>
  )

}
export default PostStats;