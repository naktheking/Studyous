import { useState } from 'react';

function Login({ setIsLoggedIn, setLoggedInUser, setUsername, username, setProfilePic }) {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const handleSignup = async (e) => {
        e.preventDefault();
        if(username === "" || password === ""){
            setMessage("Can't have blank Password or Username");
            return;
        }

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
            const response = await fetch('http://localhost:3000/account/login',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data && data.username === username) {
            setMessage('Login successful!');
            setLoggedInUser(username);
            setIsLoggedIn(true);
            setProfilePic(data.profilePic || '');
            setUsername('');
            setPassword('');
            console.log("user logged in");
        }
        else {
            setMessage(data.error || 'Login failed');
            console.log("Login failed:", data.error);
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