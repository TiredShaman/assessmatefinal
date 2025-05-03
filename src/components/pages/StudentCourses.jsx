import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BookOpen,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Home,
  Award,
  AlertCircle,
  Users,
} from 'lucide-react';
import authHeader from '../../services/authHeader';

function StudentCourses({ user }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState({}); // { courseId: [quiz1, quiz2], ... }
  const [quizLoading, setQuizLoading] = useState({}); // { courseId: true/false, ... }
  const [quizError, setQuizError] = useState({}); // { courseId: 'error message', ... }
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('StudentCourses - user:', user);
    if (!user || !user.roles || !user.roles.includes('ROLE_STUDENT')) {
      console.log('StudentCourses - redirecting to login, user:', user);
      localStorage.clear();
      navigate('/login', { state: { message: 'Please log in as a student.' } });
      return;
    }

    const fetchCourses = async () => {
      try {
        const headers = authHeader();
        console.log('StudentCourses - sending request with headers:', headers);
        if (!headers.Authorization) {
          throw new Error('No authentication token found. Please login again.');
        }

        const response = await fetch('https://assessmate-j21k.onrender.com/api/students/courses', {
          method: 'GET',
          headers,
        });
        console.log('StudentCourses - response status:', response.status);

        if (response.status === 401 || response.status === 403) {
          console.error(`Authentication/Authorization error: Status ${response.status}`);
          localStorage.clear();
          navigate('/login', { state: { message: 'Session expired or insufficient permissions. Please log in again.' } });
          throw new Error('Authentication or authorization failed.');
        }

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Fetch courses error:', response.status, errorData);
          throw new Error(errorData || `Failed to fetch courses (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log('StudentCourses - fetched courses:', data);
        if (Array.isArray(data)) {
          setCourses(data);
          // After setting courses, fetch quizzes for each course
          data.forEach(course => fetchQuizzesForCourse(course.id, headers));
        } else {
          throw new Error('Received invalid data format from server');
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch courses';
        console.error('Error fetching courses:', err);
        if (!errorMessage.includes('Authentication or authorization failed.')) {
          setError(errorMessage);
          toast.error(errorMessage, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          });
        }
      } finally {
        if (!window.location.pathname.includes('/login')) {
          setLoading(false);
        }
      }
    };
    fetchCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]); // Keep dependencies minimal, fetchQuizzesForCourse is defined below

  const fetchQuizzesForCourse = async (courseId, headers) => {
    setQuizLoading(prev => ({ ...prev, [courseId]: true }));
    setQuizError(prev => ({ ...prev, [courseId]: null }));
    try {
      // Assume this endpoint exists: GET /api/students/courses/{courseId}/quizzes
      const response = await fetch(`https://assessmate-j21k.onrender.com/api/students/courses/${courseId}/quizzes`, {
        method: 'GET',
        headers,
      });
      console.log(`StudentCourses - Quizzes for course ${courseId} - response status:`, response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Fetch quizzes error for course ${courseId}:`, response.status, errorData);
        throw new Error(errorData || `Failed to fetch quizzes (Status: ${response.status})`);
      }

      const quizData = await response.json();
      console.log(`StudentCourses - fetched quizzes for course ${courseId}:`, quizData);
      if (Array.isArray(quizData)) {
        setQuizzes(prev => ({ ...prev, [courseId]: quizData }));
      } else {
        throw new Error('Received invalid quiz data format from server');
      }
    } catch (err) {
      const errorMessage = err.message || `Failed to fetch quizzes for course ${courseId}`;
      console.error(`Error fetching quizzes for course ${courseId}:`, err);
      setQuizError(prev => ({ ...prev, [courseId]: errorMessage }));
    } finally {
      setQuizLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

  // Function to navigate to take a quiz
  const handleTakeQuiz = (quizId) => {
    navigate(`/student/take-quiz/${quizId}`); // Assuming this route exists
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Toast Container */}
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
        theme="colored"
      />

      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 z-10">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-cyan-800 to-teal-800 shadow-xl">
          <div className="flex items-center h-16 px-4 bg-gradient-to-r from-cyan-700 to-teal-700 shadow-md">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center shadow-md">
                <Award className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">AssessMate</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-3 space-y-1">
              <Link
                to="/student/dashboard"
                className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-white bg-cyan-700 bg-opacity-50 hover:bg-opacity-75 transition-all duration-200"
              >
                <Home className="mr-3 h-5 w-5 text-cyan-200" />
                Dashboard
              </Link>
              <div className="pt-5">
                <p className="px-3 text-xs font-semibold text-cyan-200 uppercase tracking-wider">Courses</p>
                <div className="mt-2 space-y-1">
                  <Link
                    to="/student/view-courses"
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                  >
                    <BookOpen className="mr-3 h-5 w-5 text-cyan-300" />
                    Enrolled Courses
                  </Link>
                  <Link
                    to="/student/available-quizzes"
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                  >
                    <HelpCircle className="mr-3 h-5 w-5 text-cyan-300" />
                    Available Quizzes
                  </Link>
                  <Link
                    to="/student/grades"
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                  >
                    <Users className="mr-3 h-5 w-5 text-cyan-300" />
                    Grades
                  </Link>
                </div>
              </div>
            </nav>
          </div>
          <div className="p-4 border-t border-cyan-700">
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white hover:bg-red-600 hover:bg-opacity-60 transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-cyan-200 group-hover:text-white" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden bg-gradient-to-r from-cyan-700 to-teal-700 z-20 fixed w-full h-16 shadow-md">
        <div className="flex justify-between items-center h-full px-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center shadow-md">
              <Award className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-bold text-white">AssessMate</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-white focus:outline-none"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-gray-900 bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-cyan-800 to-teal-800 shadow-xl transition duration-300 ease-in-out transform">
            <div className="h-16"></div>
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-3 space-y-1">
                <Link
                  to="/student/dashboard"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-white bg-cyan-700 bg-opacity-50 hover:bg-opacity-75 transition-all duration-200"
                >
                  <Home className="mr-3 h-5 w-5 text-cyan-200" />
                  Dashboard
                </Link>
                <div className="pt-5">
                  <p className="px-3 text-xs font-semibold text-cyan-200 uppercase tracking-wider">Courses</p>
                  <div className="mt-2 space-y-1">
                    <Link
                      to="/student/view-courses"
                      onClick={() => setSidebarOpen(false)}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                    >
                      <BookOpen className="mr-3 h-5 w-5 text-cyan-300" />
                      Enrolled Courses
                    </Link>
                    <Link
                      to="/student/available-quizzes"
                      onClick={() => setSidebarOpen(false)}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                    >
                      <HelpCircle className="mr-3 h-5 w-5 text-cyan-300" />
                      Available Quizzes
                    </Link>
                    <Link
                      to="/student/grades"
                      onClick={() => setSidebarOpen(false)}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                    >
                      <Users className="mr-3 h-5 w-5 text-cyan-300" />
                      Grades
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
            <div className="p-4 border-t border-cyan-700">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  localStorage.clear();
                  navigate("/login");
                }}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white hover:bg-red-600 hover:bg-opacity-60 transition-all duration-200"
              >
                <LogOut className="mr-3 h-5 w-5 text-cyan-200 group-hover:text-white" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <div className="md:hidden h-16"></div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Header */}
              <div className="bg-white shadow-md rounded-lg mb-6 p-4">
                <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
                <p className="text-gray-600">Explore your enrolled courses</p>
              </div>

              {/* Error state */}
              {error && !error.includes('Authentication or authorization failed.') && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md flex items-center animate-fade-in">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                  <button
                    onClick={() => navigate('/student/dashboard')}
                    className="ml-auto inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 transition-all duration-200"
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}

              {/* Loading state */}
              {loading ? (
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-600">Loading courses...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
                  <p>You are not enrolled in any courses yet.</p>
                  <button
                    onClick={() => navigate('/student/dashboard')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 transition-all duration-200"
                  >
                    Back to Dashboard
                  </button>
                </div>
              ) : (
                <div className="bg-white overflow-hidden shadow-md rounded-lg">
                  <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-cyan-700 to-teal-700">
                    <h3 className="text-lg leading-6 font-medium text-white">Enrolled Courses ({courses.length})</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {courses.map((course) => (
                        <div
                          key={course.id}
                          className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center mb-2">
                            <BookOpen className="h-6 w-6 text-cyan-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">{course.title || course.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">Code: {course.code || 'N/A'}</p>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{course.description || 'No description available'}</p>
                          <p className="text-sm text-gray-600 mb-4">Instructor: {course.instructorUsername || 'N/A'}</p>

                          {/* Quiz Section */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Available Quizzes</h4>
                            {quizLoading[course.id] && (
                              <div className="flex items-center text-sm text-gray-500">
                                <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                                Loading quizzes...
                              </div>
                            )}
                            {quizError[course.id] && (
                              <div className="flex items-center text-sm text-red-600">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Error: {quizError[course.id]}
                              </div>
                            )}
                            {!quizLoading[course.id] && !quizError[course.id] && (
                              quizzes[course.id] && quizzes[course.id].length > 0 ? (
                                <ul className="space-y-2">
                                  {quizzes[course.id].map((quiz) => (
                                    <li key={quiz.id} className="flex justify-between items-center text-sm">
                                      <span className="text-gray-800">{quiz.title}</span>
                                      <button
                                        onClick={() => handleTakeQuiz(quiz.id)}
                                        className="bg-teal-600 text-white px-2 py-1 rounded text-xs hover:bg-teal-700 transition-all duration-200"
                                      >
                                        Take Quiz
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500">No quizzes available for this course yet.</p>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentCourses;
