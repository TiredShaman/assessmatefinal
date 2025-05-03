import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from '../../config/config.js';

function AuthCallback({ setUser }) {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token');
    const error = params.get('error');
    const needsRoleSelection = params.get('needsRoleSelection') === 'true';

    if (token) {
      fetch(`${config.API_URL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Session expired or invalid token');
          }
          if (!response.ok) {
            throw new Error(`Network error: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (!data || !data.id || !data.username) {
            throw new Error('Invalid user data received');
          }
          const userData = {
            id: data.id,
            username: data.username,
            email: data.email,
            fullName: data.fullName,
            roles: Array.isArray(data.roles) ? data.roles : [],
            token: token,
          };
          if (needsRoleSelection) {
            navigate('/login', { state: { userData, needsRoleSelection: true } });
          } else {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('jwtToken', token);
            localStorage.setItem('token', token);
            setUser(userData);
            toast.success('Login successful!', { position: 'top-right', autoClose: 3000 });
            navigate('/dashboard');
          }
        })
        .catch(err => {
          const errorMessage = err.message || 'Authentication failed. Please try again.';
          // Clear any existing auth data
          localStorage.removeItem('user');
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('token');
          toast.error(errorMessage, { 
            position: 'top-right', 
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
          });
          console.error('Authentication error:', err);
          navigate('/login', { state: { message: errorMessage } });
        });
    } else if (error) {
      const decodedError = decodeURIComponent(error);
      toast.error(decodedError, { position: 'top-right', autoClose: 3000 });
      navigate('/login', { state: { message: decodedError } });
    } else {
      navigate('/login');
    }
  }, [search, navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 max-w-md w-full bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-center mt-4 text-gray-700 font-medium">Completing authentication...</p>
      </div>
    </div>
  );
}

export default AuthCallback;