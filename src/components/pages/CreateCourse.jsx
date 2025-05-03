import React, { useState } from 'react';
import authHeader from '../../services/authHeader';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Sidebar from '../dashboard/Sidebar';

function CreateCourse({ user }) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const courseData = { title, code, description };

    try {
      const response = await fetch('https://assessmate-j21k.onrender.com/api/teachers/courses', {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError("You do not have permission to create courses.");
        } else {
          throw new Error(data.message || `Failed to create course with status ${response.status}`);
        }
      } else {
        setMessage(data.message || 'Course created successfully!');
        setTitle('');
        setCode('');
        setDescription('');
      }
    } catch (err) {
      console.error('Error creating course:', err);
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans antialiased flex">
      <Sidebar user={user} activeItem="create-course" onLogout={handleLogout} />

      <div className="flex flex-col flex-1 md:pl-80">
        <div className="md:hidden h-16"></div>
        <main className="flex-1">
          <div className="py-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 transform transition-all duration-500 animate-fade-in">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6 text-center">
                  Create a New Course
                </h1>
                <p className="text-gray-600 text-lg font-medium text-center mb-8">
                  Set up a new course for your students
                </p>

                {message && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 mb-6 rounded-2xl flex items-center animate-pulse">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                    <p className="font-medium">{message}</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-2xl flex items-center animate-pulse">
                    <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                    >
                      <div className="flex items-center">
                        <BookOpen size={20} className="mr-2 text-cyan-600" />
                        Course Title
                      </div>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 transition-all duration-300 hover:shadow-md"
                      placeholder="e.g., Introduction to Computer Science"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="code"
                      className="block text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                    >
                      <div className="flex items-center">
                        <Code size={20} className="mr-2 text-cyan-600" />
                        Course Code
                      </div>
                    </label>
                    <input
                      type="text"
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 transition-all duration-300 hover:shadow-md"
                      placeholder="e.g., CS101"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                    >
                      <div className="flex items-center">
                        <FileText size={20} className="mr-2 text-cyan-600" />
                        Description
                      </div>
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 transition-all duration-300 hover:shadow-md"
                      placeholder="Brief course description..."
                      rows="4"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-2xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Creating Course...' : 'Create Course'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateCourse;