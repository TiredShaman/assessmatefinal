import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!role) {
      setError('Please select a role');
      toast.error('Please select a role', { position: 'top-right', autoClose: 3000 });
      setLoading(false);
      return;
    }

    const payload = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      fullName: fullName.trim(),
      roles: [role],
    };

    try {
      const response = await fetch('https://assessmate-j21k.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setShowSuccessModal(true);
      toast.success('Signup successful! Please log in.', { position: 'top-right', autoClose: 3000 });
    } catch (err) {
      const errorMessage = err.message || 'Failed to signup';
      setError(errorMessage);
      toast.error(errorMessage, { position: 'top-right', autoClose: 3000 });
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-100 to-blue-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-30 pointer-events-none"></div>
      <ToastContainer
        toastClassName="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl shadow-xl"
        progressClassName="bg-cyan-400"
      />
      <div className="max-w-lg w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 animate-in zoom-in-90 duration-500 border border-cyan-100/50">
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-8 py-6 rounded-t-3xl flex items-center justify-center">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">AssessMate Signup</h2>
        </div>
        <div className="pt-8 space-y-6">
          {error && (
            <p className="text-red-500 text-sm flex items-center bg-red-50/90 py-3 px-4 rounded-xl">
              <span className="mr-2">⚠️</span> {error}
            </p>
          )}
          <form onSubmit={handleSignup} className="space-y-6">
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
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full px-5 py-4 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                required
                placeholder="Your email"
              />
            </div>
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 w-full px-5 py-4 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                required
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full px-5 py-4 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                required
                placeholder="Your password"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800">Role</label>
              <div className="mt-2 space-y-4">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                    role === 'STUDENT'
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('TEACHER')}
                  className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                    role === 'TEACHER'
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Teacher
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
                'Sign Up'
              )}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors duration-200">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-50 duration-300">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-cyan-100/50">
            <div className="flex justify-center mb-4">
              <Award className="w-12 h-12 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 text-center tracking-tight">
              Account Created!
            </h3>
            <p className="text-center text-gray-600 mt-2">
              Your account has been successfully created. Please log in to continue.
            </p>
            <button
              onClick={handleModalClose}
              className="w-full mt-6 py-3 px-6 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-lg transition-all duration-300"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;