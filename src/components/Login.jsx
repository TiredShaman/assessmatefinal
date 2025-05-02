import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { login } from '../services/authService';

const BASE_URL = 'http://localhost:5173';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      history.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handlePopupWindow = () => {
    const authUrl = `${BASE_URL}/auth`;
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'oauth-popup',
      `width=${width},height=${height},left=${left},top=${top},status=yes,scrollbars=yes`
    );

    const messageHandler = (event) => {
      // Verify origin with correct port
      if (event.origin !== BASE_URL) {
        return;
      }

      try {
        const { type, token, error } = event.data;
        
        if (type === 'oauth-response') {
          if (error) {
            setError(error);
          } else if (token) {
            handleAuthSuccess({ token });
          }
          window.removeEventListener('message', messageHandler);
        }
      } catch (err) {
        console.error('Error processing authentication:', err);
      }
    };

    window.addEventListener('message', messageHandler);
  };

  const handleAuthSuccess = (authResult) => {
    if (authResult.token) {
      // Store token in localStorage or state management
      localStorage.setItem('auth_token', authResult.token);
      history.push('/role-selection'); // Redirect to role selection page since user has no roles
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <button onClick={handlePopupWindow}>Login with Popup</button>
    </div>
  );
};

export default Login;