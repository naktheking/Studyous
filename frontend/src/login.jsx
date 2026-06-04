import { useState } from 'react';

function Login({ setIsLoggedIn, setLoggedInUser, setUsername, username, setProfilePic }) {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const handleSignup = async (e) => {
        e.preventDefault();
    
        try {
        const response = await fetch('http://localhost:3000/account/create-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
      
        if (response.ok) {
            setMessage('Account created! Try logging in.');
            setUsername('');
            setPassword('');
        } else {
            setMessage(data.error);
        }
        } catch (err) {
        setMessage('Error: ' + err.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch(`http://localhost:3000/account/get-account?username=${username}`,{ 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
      
        if (data && data.username === username) {
            setMessage('Login successful!');
            setLoggedInUser(username);
            setIsLoggedIn(true);
            setProfilePic(data.profilePic || '');
            setUsername('');
            setPassword('');
            console.log("user logged in");
        } 
        else {
            setMessage('User not found');
            console.log("User not found");
        }
        } catch (err) {
            setMessage('Error: ' + err.message);
        }
    };

    return(
        <form className="login-form" onSubmit={handleSignup}>
          <h2>Create Account/Sign in</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="login-actions">
            <button type="submit" className="login-btn login-btn--primary">Sign Up</button>
            <button type="button" className="login-btn login-btn--secondary" onClick={handleLogin}>Login</button>
          </div>
          {message && <p className="login-message">{message}</p>}
        </form>
    )

}
export default Login;