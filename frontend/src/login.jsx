import { useState } from 'react';

function Login({ setIsLoggedIn, setLoggedInUser, setUsername, username}) {
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
            const response = await fetch(`http://localhost:3000/account/get-account?username=${username}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
      
        if (data && data.username === username) {
            setMessage('Login successful!');
            setLoggedInUser(username);
            setIsLoggedIn(true);
            setUsername('');
            setPassword('');
        } 
        else {
            setMessage('User not found');
        }
        } catch (err) {
            setMessage('Error: ' + err.message);
        }
    };

    return(
        <form onSubmit={handleSignup}>
          <h2>Create Account</h2>
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
          <button type="submit">Sign Up</button>
          <button type="button" onClick={handleLogin}>Login</button>
          {message && <p>{message}</p>}
        </form>
    )

}
export default Login;