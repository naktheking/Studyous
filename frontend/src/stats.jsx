import { useState, useEffect } from 'react';
import usePosts from './utils/usePosts.js';

function PostStats({ stats, setStats, username }) {
  const posts = usePosts('http://localhost:3000/history/get-posts', stats, username);

  function getTime(posts) {
    let minutes = 0;
    const now = new Date();

    // Get current week start (Monday)
    const currentDay = now.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Monday is 0
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysFromMonday);
    weekStart.setHours(0, 0, 0, 0);

    posts.forEach(post => {
      const postEndDateTime = new Date(`${post.date} ${post.endTime}`);
      const postDate = new Date(post.date + "T00:00:00"); // makes it so it is LOCAL time.
      postDate.setHours(0, 0, 0, 0);

      // Only count this post if it has already ended AND is from this week
      if (postEndDateTime <= now && postDate >= weekStart) {
        let startMins = (parseInt(post.startTime.slice(0, 2)) * 60) + parseInt(post.startTime.slice(3, 5));
        let endMins = (parseInt(post.endTime.slice(0, 2)) * 60) + parseInt(post.endTime.slice(3, 5));

        minutes += endMins - startMins;
      }
    })

    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    return `${hours} hours, ${minutes} minutes`;
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
    // Count occurrences of submitted locations
    const locations = new Map();
    posts.forEach(post => {
      if (locations.has(post.location)) {
        locations.set(post.location, locations.get(post.location) + 1);
      }
      else {
        locations.set(post.location, 1);
      }
    });

    // Determine and return most frequently submitted location
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
              <p className="stat-value">{getTime(posts)}</p>
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