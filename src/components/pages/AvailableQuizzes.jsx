import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  HelpCircle,
  LogOut,
  Menu,
  X,
  Home,
  Award,
  AlertCircle,
  BookOpen,
  Users,
} from 'lucide-react';
import authHeader from '../../services/authHeader';

function AvailableQuizzes({ user }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || !user.roles || !user.roles.includes("ROLE_STUDENT")) {
      console.log("AvailableQuizzes - redirecting to login, user:", user);
      localStorage.clear();
      navigate("/login", { state: { message: "Please log in as a student." } });
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const headers = authHeader();
        console.log("Fetching quizzes with headers:", headers, "courseId:", courseId);
        const response = await fetch(`http://localhost:8080/api/students/courses/${courseId}/quizzes`, {
          method: 'GET',
          headers,
        });
        console.log("Quizzes response status:", response.status);
        if (!response.ok) {
          const errorData = await response.text();
          console.error("Fetch quizzes error:", response.status, errorData);
          throw new Error(errorData || 'Failed to fetch quizzes');
        }
        const data = await response.json();
        console.log("Quizzes data received:", data);
        setQuizzes(data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError(err.message || 'Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [courseId, user, navigate]);

  const handleTakeQuiz = (quizId) => {
    navigate(`/student/take-quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
              <div className="bg-white shadow-md rounded-lg mb-6 p-4">
                <h1 className="text-2xl font-bold text-gray-800">Available Quizzes</h1>
                <p className="text-gray-600">Select a quiz to start</p>
              </div>
              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md flex items-center animate-fade-in">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              )}
              {loading ? (
                <div className="text-center">
                  <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-600">Loading quizzes...</p>
                </div>
              ) : quizzes.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
                  <p>No quizzes available for this course.</p>
                  <Link
                    to="/student/view-courses"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700"
                  >
                    View Courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{quiz.description || 'No description available'}</p>
                      <button
                        onClick={() => handleTakeQuiz(quiz.id)}
                        className="bg-cyan-600 text-white px-3 py-1 rounded text-sm hover:bg-cyan-700 transition-all duration-200"
                      >
                        Take Quiz
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AvailableQuizzes;