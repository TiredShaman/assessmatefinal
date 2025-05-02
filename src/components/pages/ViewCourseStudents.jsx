import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  User,
} from 'lucide-react';
import authHeader from '../../services/authHeader';

function ViewCourseStudents({ user }) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || !user.roles || !user.roles.includes("ROLE_TEACHER")) {
      console.log("ViewCourseStudents - redirecting to login, user:", user);
      localStorage.clear();
      navigate("/login", { state: { message: "Please log in as a teacher." } });
      return;
    }

    const fetchStudents = async () => {
      try {
        const headers = authHeader();
        console.log("Fetching students with headers:", headers, "courseId:", courseId);
        if (!headers.Authorization) {
          throw new Error("No authentication token found. Please login again.");
        }

        const response = await fetch(`http://localhost:8080/api/teachers/courses/${courseId}/students`, {
          method: 'GET',
          headers,
        });
        console.log("Students response status:", response.status);
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("You do not have permission to view students for this course.");
          } else if (response.status === 401) {
            localStorage.clear();
            navigate("/login", { state: { message: "Session expired. Please login again." } });
            return;
          } else {
            const errorData = await response.text();
            console.error("Fetch students error:", response.status, errorData);
            throw new Error(errorData || `Failed to fetch students (Status: ${response.status})`);
          }
        }

        const data = await response.json();
        console.log("Students data received:", data);
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          throw new Error("Received invalid data format from server");
        }

        try {
          const courseResponse = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
            method: 'GET',
            headers,
          });
          console.log("Course response status:", courseResponse.status);
          if (courseResponse.ok) {
            const courseData = await courseResponse.json();
            setCourseName(courseData.name || courseData.title || `Course ${courseId}`);
          } else {
            console.warn("Failed to fetch course details, using default name");
            setCourseName(`Course ${courseId}`);
          }
        } catch (courseErr) {
          console.error('Error fetching course details:', courseErr);
          setCourseName(`Course ${courseId}`);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [courseId, navigate, user]);

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
                to="/teacher/dashboard"
                className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-white bg-cyan-700 bg-opacity-50 hover:bg-opacity-75 transition-all duration-200"
              >
                <Home className="mr-3 h-5 w-5 text-cyan-200" />
                Dashboard
              </Link>
              <div className="pt-5">
                <p className="px-3 text-xs font-semibold text-cyan-200 uppercase tracking-wider">Courses</p>
                <div className="mt-2 space-y-1">
                  <Link
                    to="/teacher/view-courses"
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                  >
                    <BookOpen className="mr-3 h-5 w-5 text-cyan-300" />
                    My Courses
                  </Link>
                  <Link
                    to="/teacher/create-quiz"
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                  >
                    <HelpCircle className="mr-3 h-5 w-5 text-cyan-300" />
                    Create Quiz
                  </Link>
                  <Link
                    to="/teacher/view-students"
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                  >
                    <Users className="mr-3 h-5 w-5 text-cyan-300" />
                    View Students
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
                  to="/teacher/dashboard"
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
                      to="/teacher/view-courses"
                      onClick={() => setSidebarOpen(false)}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                    >
                      <BookOpen className="mr-3 h-5 w-5 text-cyan-300" />
                      My Courses
                    </Link>
                    <Link
                      to="/teacher/create-quiz"
                      onClick={() => setSidebarOpen(false)}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                    >
                      <HelpCircle className="mr-3 h-5 w-5 text-cyan-300" />
                      Create Quiz
                    </Link>
                    <Link
                      to="/teacher/view-students"
                      onClick={() => setSidebarOpen(false)}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-50 transition-all duration-200"
                    >
                      <Users className="mr-3 h-5 w-5 text-cyan-300" />
                      View Students
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
                <h1 className="text-2xl font-bold text-gray-800">
                  {courseName ? `Students in ${courseName}` : `Students in Course ${courseId}`}
                </h1>
                <p className="text-gray-600">Manage enrolled students</p>
              </div>

              {/* Error state */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md flex items-center animate-fade-in">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                  <button
                    onClick={() => navigate('/teacher/dashboard')}
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
                  <p className="text-gray-600">Loading students...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
                  <p>No students enrolled in this course yet.</p>
                  <Link
                    to={`/teacher/enroll-student?courseId=${courseId}`}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 transition-all duration-200"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Enroll a Student
                  </Link>
                </div>
              ) : (
                <div className="bg-white overflow-hidden shadow-md rounded-lg">
                  <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-cyan-700 to-teal-700">
                    <h3 className="text-lg leading-6 font-medium text-white">Enrolled Students ({students.length})</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {students.map((student) => (
                        <div
                          key={student.id}
                          className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                                <span className="text-cyan-800 font-medium text-lg">
                                  {student.fullName ? student.fullName.charAt(0).toUpperCase() : student.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{student.fullName || 'N/A'}</p>
                              <p className="text-sm text-gray-500">{student.username}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                    <button
                      onClick={() => navigate('/teacher/dashboard')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                    >
                      Back to Dashboard
                    </button>
                    <Link
                      to={`/teacher/enroll-student?courseId=${courseId}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 transition-all duration-200"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Enroll More Students
                    </Link>
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

export default ViewCourseStudents;