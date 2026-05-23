import { useState, useEffect } from 'react';

function PostStats({ stats, setStats, person })
{
    return(
        <div className="post_info">
        { stats ? (
          <p>Stats here</p>
        ) : (
          <button className="stats-button" onClick={() => setStats(true)}>View Post History</button>
        )}
        </div>
    )
    
}
export default PostStats;