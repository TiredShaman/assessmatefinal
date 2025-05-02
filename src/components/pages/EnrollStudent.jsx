import React, { useState, useEffect } from 'react';
import authHeader from '../../services/authHeader';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, AlertCircle, CheckCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../dashboard/Sidebar';

function EnrollStudent({ user, onEnroll }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !Array.isArray(user.roles) || !user.roles.includes('ROLE_TEACHER')) {
      console.log('EnrollStudent - redirecting to login');
      localStorage.clear();
      navigate('/login', { state: { message: 'Please log in as a teacher to access this page.' } });
      return;
    }

    const fetchCourses = async () => {
      try {
        const headers = authHeader();
        const response = await fetch('http://localhost:8080/api/teachers/courses', {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in again.');
          } else if (response.status === 403) {
            throw new Error('You do not have permission to view courses.');
          }
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch courses with status ${response.status}`);
        }

        const data = await response.json();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].id); // Select the first course by default
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Failed to fetch courses');
        toast.error(err.message || 'Failed to fetch courses', {
          className: 'bg-red-100 text-red-800 rounded-xl',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    console.log('handleSubmit called');
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!selectedCourseId) {
      setError('Please select a course.');
      setLoading(false);
      toast.error('Please select a course.', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
      return;
    }

    try {
      const headers = authHeader();
      const response = await fetch(`http://localhost:8080/api/teachers/courses/${selectedCourseId}/students`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to enroll students.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to enroll student with status ${response.status}`);
      }

      const data = await response.json();
      setUsername('');
      setMessage(data.message || 'Student enrolled successfully!');
      toast.success(data.message || 'Student enrolled successfully!', {
        className: 'bg-green-100 text-green-800 rounded-xl',
      });
      if (onEnroll) {
        onEnroll(); // Notify parent component
      }
    } catch (err) {
      console.error('Error enrolling student:', err);
      setError(err.message || 'Failed to enroll student');
      toast.error(err.message || 'Failed to enroll student', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
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
      <Sidebar user={user} activeItem="enroll-student" onLogout={handleLogout} />

      <div className="flex flex-col flex-1 md:pl-80">
        <div className="md:hidden h-16"></div>
        <main className="flex-1">
          <div className="py-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 transform transition-all duration-500 animate-fade-in">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6 text-center">
                  Enroll a Student
                </h1>
                <p className="text-gray-600 text-lg font-medium text-center mb-8">
                  Add a student to one of your courses
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

                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-600">Loading courses...</p>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-20">
                    <BookOpen size={100} className="text-cyan-600 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">No Courses Found</h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                      You need to create a course before enrolling students.
                    </p>
                    <button
                      onClick={() => navigate('/teacher/create-course')}
                      className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white text-xl font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                    >
                      Create a Course
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                      <label
                        htmlFor="course"
                        className="block text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                      >
                        <div className="flex items-center">
                          <BookOpen size={20} className="mr-2 text-cyan-600" />
                          Select Course
                        </div>
                      </label>
                      <select
                        id="course"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 transition-all duration-300 hover:shadow-md"
                        required
                      >
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title} ({course.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                      >
                        <div className="flex items-center">
                          <User size={20} className="mr-2 text-cyan-600" />
                          Student Username
                        </div>
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 transition-all duration-300 hover:shadow-md"
                        placeholder="Enter student username"
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
                        {loading ? 'Enrolling Student...' : 'Enroll Student'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="rounded-xl animate-fade-in"
      />
    </div>
  );
}

export default EnrollStudent;
