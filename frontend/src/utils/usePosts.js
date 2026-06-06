import { useState, useEffect } from 'react';

function usePosts(url, isOpen, username) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Only request posts once feature is actually opened
    console.log('usePosts effect ran', isOpen, username);
    if (!isOpen) {
      setPosts([]);
      return;
    }

    // Request posts of logged-in user from server
    const fetchPosts = async (e) => {
      try {
        const response = await fetch(`${url}?username=${username}`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
        const userData = await response.json();
        console.log('fetched posts:', userData);
        setPosts(userData.posts);
      } catch (err) {
          console.error(err);
      }
    };

    fetchPosts();
  }, [username, isOpen]);

  return posts;
}
export default usePosts;