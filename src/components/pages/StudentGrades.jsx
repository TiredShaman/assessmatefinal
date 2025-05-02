import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Home,
  Award,
  AlertCircle,
} from 'lucide-react';
import authHeader from '../../services/authHeader';

function StudentGrades({ user }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.roles || !user.roles.includes("ROLE_STUDENT")) {
      console.log("StudentGrades - redirecting to login, user:", user);
      localStorage.clear();
      navigate("/login", { state: { message: "Please log in as a student." } });
      return;
    }

    const fetchGrades = async () => {
      try {
        const headers = authHeader();
        console.log("Fetching grades with headers:", headers);
        const response = await fetch('http://localhost:8080/api/students/grades', {
          method: 'GET',
          headers,
        });
        console.log("Grades response status:", response.status);
        if (!response.ok) {
          const errorData = await response.text();
          console.error("Fetch grades error:", response.status, errorData);
          throw new Error(errorData || 'Failed to fetch grades');
        }
        const data = await response.json();
        console.log("Grades data received:", data);
        setGrades(data);
      } catch (err) {
        console.error("Error fetching grades:", err);
        setError(err.message || 'Failed to fetch grades');
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [user, navigate]);

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
                <h1 className="text-2xl font-bold text-gray-800">My Grades</h1>
                <p className="text-gray-600">View your quiz grades</p>
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
                  <p className="text-gray-600">Loading grades...</p>
                </div>
              ) : grades.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
                  <p>No grades available.</p>
                  <Link
                    to="/student/available-quizzes"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700"
                  >
                    Take a Quiz
                  </Link>
                </div>
              ) : (
                <div className="bg-white overflow-hidden shadow-md rounded-lg">
                  <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-cyan-700 to-teal-700">
                    <h3 className="text-lg leading-6 font-medium text-white">Grades Overview</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quiz Title
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grade
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {grades.map((grade) => (
                          <tr key={grade.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grade.quizTitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.courseName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.score}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default StudentGrades;