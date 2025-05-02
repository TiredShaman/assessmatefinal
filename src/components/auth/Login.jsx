import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Award } from 'lucide-react';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRolePrompt, setShowRolePrompt] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [tempUserData, setTempUserData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Added for modal
  const navigate = useNavigate();
  const { state, search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get('token');
    const errorMsg = params.get('error');
    const needsRoleSelection = params.get('needsRoleSelection') === 'true';

    if (token) {
      handleTokenValidation(token, needsRoleSelection);
    } else if (errorMsg) {
      const decodedError = decodeURIComponent(errorMsg);
      setError(decodedError);
      toast.error(decodedError, { position: 'top-right', autoClose: 3000 });
    }

    if (state?.userData && state?.needsRoleSelection) {
      setTempUserData(state.userData);
      setShowRolePrompt(true);
    }
  }, [search, state]);

  useEffect(() => {
    let popup = null;
    let checkPopupInterval = null;

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
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
          window.removeEventListener('message', handleMessage);
        }
      } catch (err) {
        console.error('Error processing authentication:', err);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (checkPopupInterval) {
        clearInterval(checkPopupInterval);
      }
    };
  }, []);

  const handleTokenValidation = (token, needsRoleSelection) => {
    fetch('http://localhost:8080/api/auth/validate', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to validate login token');
        }
        return response.json();
      })
      .then(data => {
        const userData = {
          id: data.id,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          roles: data.roles,
          token: token,
        };

        if (needsRoleSelection) {
          setTempUserData(userData);
          setShowRolePrompt(true);
        } else {
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('jwtToken', token);
          localStorage.setItem('token', token);
          setUser(userData);
          setShowSuccessModal(true); // Show modal on successful login
          toast.success('Login successful!', { position: 'top-right', autoClose: 3000 });
          navigate('/dashboard');
        }
      })
      .catch(err => {
        const errorMessage = err.message || 'Failed to validate login';
        setError(errorMessage);
        toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
        console.error('Login validation error:', err);
      });
  };

  const handleRoleSelection = () => {
    if (!selectedRole) {
      setError('Please select a role');
      toast.error('Please select a role', { position: 'top-right', autoClose: 3000 });
      return;
    }

    fetch('http://localhost:8080/api/auth/set-role', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tempUserData.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: selectedRole }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to set role');
        }
        return response.json();
      })
      .then(data => {
        const updatedUserData = {
          id: data.id,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          roles: data.roles,
          token: data.token,
        };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('token', data.token);
        setUser(updatedUserData);
        setShowRolePrompt(false);
        setTempUserData(null);
        setSelectedRole('');
        setShowSuccessModal(true); // Show modal on successful role assignment
        toast.success('Role assigned successfully!', { position: 'top-right', autoClose: 3000 });
        navigate('/dashboard');
      })
      .catch(err => {
        const errorMessage = err.message || 'Failed to set role';
        setError(errorMessage);
        toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
        console.error('Role assignment error:', err);
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = { username: username.trim(), password: password.trim() };
    console.log('Sending login payload:', payload);

    try {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Login response status:', response.status, 'data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Login failed with status ${response.status}`);
      }

      const userData = {
        id: data.id,
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        roles: data.roles,
        token: data.token,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('jwtToken', data.token);
      localStorage.setItem('token', data.token);
      console.log('Stored user in localStorage:', userData);

      setUser(userData);
      setShowSuccessModal(true); // Show modal on successful form login
      toast.success('Login successful!', { position: 'top-right', autoClose: 3000 });
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.message || 'Failed to login';
      setError(errorMessage);
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      'http://localhost:8080/oauth2/authorization/google',
      'googleOAuth',
      `width=${width},height=${height},left=${left},top=${top},status=yes,scrollbars=yes`
    );
  
    if (!popup) {
      setError('Failed to open popup. Please allow popups for this site.');
      toast.error('Failed to open popup', { position: 'top-right', autoClose: 3000 });
      return;
    }

    // Instead of checking popup.closed, use a message-based approach
    const handleMessage = (event) => {
      // Verify origin
      if (event.origin !== 'http://localhost:8080') {
        return;
      }

      try {
        const { token, error, needsRoleSelection } = event.data;
        
        if (error) {
          setError(error);
          toast.error(error, { position: 'top-right', autoClose: 3000 });
        } else if (token) {
          handleTokenValidation(token, needsRoleSelection);
        }
      } catch (err) {
        console.error('Error processing OAuth response:', err);
        setError('Failed to process authentication response');
        toast.error('Authentication failed', { position: 'top-right', autoClose: 3000 });
      } finally {
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    // Clean up after 5 minutes (maximum OAuth flow time)
    setTimeout(() => {
      window.removeEventListener('message', handleMessage);
    }, 300000);
  };

  // Added function to handle modal close
  const handleModalClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-100 to-blue-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-30 pointer-events-none"></div>
      <ToastContainer
        toastClassName="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl shadow-xl"
        progressClassName="bg-cyan-400"
      />
      <div className="max-w-lg w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 animate-in zoom-in-90 duration-500 border border-cyan-100/50">
        {showRolePrompt ? (
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight">
              Select Your Role
            </h2>
            <p className="text-center text-gray-600 text-lg font-medium">
              Are you a Student or a Teacher?
            </p>
            {error && (
              <p className="text-red-500 text-sm flex items-center justify-center bg-red-50/90 py-3 px-4 rounded-xl">
                <span className="mr-2">⚠️</span> {error}
              </p>
            )}
            <div className="space-y-4">
              <button
                onClick={() => setSelectedRole('STUDENT')}
                className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  selectedRole === 'STUDENT'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setSelectedRole('TEACHER')}
                className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  selectedRole === 'TEACHER'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Teacher
              </button>
              <button
                onClick={handleRoleSelection}
                className="w-full py-4 px-6 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-lg transition-all duration-300"
              >
                Confirm Role
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-8 py-6 rounded-t-3xl flex items-center justify-center">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg mr-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-extrabold text-white tracking-tight">AssessMate</h2>
            </div>
            <div className="pt-8 space-y-6">
              {state?.message && (
                <p className="text-red-500 text-sm flex items-center bg-red-50/90 py-3 px-4 rounded-xl">
                  <span className="mr-2">⚠️</span> {state.message}
                </p>
              )}
              {error && (
                <p className="text-red-500 text-sm flex items-center bg-red-50/90 py-3 px-4 rounded-xl">
                  <span className="mr-2">⚠️</span> {error}
                </p>
              )}
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-800">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-2 w-full px-5 py-4 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                    required
                    placeholder="Your username"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 w-full px-5 py-4 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                      required
                      placeholder="Your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-cyan-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:from-cyan-400 disabled:to-teal-400 disabled:cursor-not-allowed shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  {loading ? (
                    <Award className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '1s' }} />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-300"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google Logo"
                  className="w-6 h-6 mr-3"
                />
                Sign in with Google
              </button>
              <p className="text-center text-sm text-gray-600 font-medium">
                Don't have an account?{' '}
                <Link to="/signup" className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors duration-200">
                  Sign up
                </Link>
              </p>
            </div>
          </>
        )}
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-50 duration-300">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-cyan-100/50">
            <div className="flex justify-center mb-4">
              <Award className="w-12 h-12 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 text-center tracking-tight">
              Login Successful!
            </h3>
            <p className="text-center text-gray-600 mt-2">
              Welcome back! You're now logged in. Proceed to your dashboard.
            </p>
            <button
              onClick={handleModalClose}
              className="w-full mt-6 py-3 px-6 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-lg transition-all duration-300"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;