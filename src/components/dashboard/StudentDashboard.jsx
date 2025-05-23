import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Home,
  Award,
  CheckCircle,
  AlertCircle,
  User,
} from 'lucide-react';
import authHeader from "../../services/authHeader";

function StudentDashboard({ user }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedQuizzes: 0,
    pendingQuizzes: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!user || !user.roles || !user.roles.includes("ROLE_STUDENT")) {
      console.log("StudentDashboard - redirecting to login, user:", user);
      setIsAuthenticated(false);
      localStorage.clear();
      navigate("/login", { state: { message: "Please log in as a student." } });
    } else {
      setIsAuthenticated(true);
      fetchCourses();
      fetchStudentStats();
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCourses = async () => {
    setCoursesLoading(true);
    setCoursesError(null);
    try {
      const headers = authHeader();
      console.log("Fetching courses with headers:", headers);
      const response = await fetch("https://assessmate-j21k.onrender.com/api/students/courses", {
        method: "GET",
        headers,
      });
      console.log("Courses response status:", response.status);
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Fetch courses error:", response.status, errorData);
        throw new Error(errorData || `Failed to fetch courses (Status: ${response.status})`);
      }
      const data = await response.json();
      console.log("Courses data received:", data);
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error("Invalid data structure received:", data);
        throw new Error("Received invalid course data format");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCoursesError(err.message || "Failed to fetch courses");
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchStudentStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const headers = authHeader();
      console.log("Fetching stats with headers:", headers);

      // Fetch enrolled courses
      const coursesResponse = await fetch("https://assessmate-j21k.onrender.com/api/students/courses", { headers });
      if (!coursesResponse.ok) {
        const errorBody = await coursesResponse.text();
        console.error("enrolledCourses API error:", coursesResponse.status, errorBody);
        throw new Error(`Failed to fetch enrolled courses: ${coursesResponse.status} ${coursesResponse.statusText}`);
      }
      const coursesData = await coursesResponse.json();
      const enrolledCoursesCount = Array.isArray(coursesData) ? coursesData.length : 0;
      console.log("enrolledCourses fetched:", enrolledCoursesCount);

      // Fetch completed quizzes
      const submissionsResponse = await fetch("https://assessmate-j21k.onrender.com/api/students/submissions", { headers });
      if (!submissionsResponse.ok) {
        const errorBody = await submissionsResponse.text();
        console.error("completedQuizzes API error:", submissionsResponse.status, errorBody);
        throw new Error(`Failed to fetch completed quizzes: ${submissionsResponse.status} ${submissionsResponse.statusText}`);
      }
      const submissionsData = await submissionsResponse.json();
      const completedQuizzesCount = Array.isArray(submissionsData) ? submissionsData.length : 0;
      console.log("completedQuizzes fetched:", completedQuizzesCount);

      // Fetch active quizzes (need to fetch courses first)
      let activeQuizzesCount = 0;
      if (Array.isArray(coursesData)) {
        for (const course of coursesData) {
          const courseId = course.id;
          const activeQuizzesResponse = await fetch(`https://assessmate-j21k.onrender.com/api/students/courses/${courseId}/quizzes`, { headers });
          if (!activeQuizzesResponse.ok) {
            const errorBody = await activeQuizzesResponse.text();
            console.error("activeQuizzes API error:", activeQuizzesResponse.status, errorBody);
            throw new Error(`Failed to fetch active quizzes for course ${courseId}: ${activeQuizzesResponse.status} ${coursesResponse.statusText}`);
          }
          const activeQuizzesData = await activeQuizzesResponse.json();
          activeQuizzesCount += Array.isArray(activeQuizzesData) ? activeQuizzesData.length : 0;
        }
      }
      console.log("activeQuizzes fetched:", activeQuizzesCount);

      setStats({
        enrolledCourses: enrolledCoursesCount,
        completedQuizzes: completedQuizzesCount,
        pendingQuizzes: activeQuizzesCount,
      });
    } catch (err) {
      console.error('Error fetching student stats:', err);
      setStatsError('Failed to load stats.');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStats({
      enrolledCourses: 0,
      completedQuizzes: 0,
      pendingQuizzes: 0,
    });
    localStorage.clear();
    sessionStorage.clear();
    
    // Use window.location.href instead of navigate
    window.location.href = '/login';
  };

  const handleViewQuizzes = (courseId) => {
    navigate(`/student/available-quizzes?courseId=${courseId}`);
  };

  if (!isAuthenticated) {
    return null;
  }

  const renderStatItem = (count, label, icon, bgColor) => (
    <div className="flex items-center bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: bgColor }}>
      <div className={`flex-shrink-0 p-3 rounded-full`} style={{ backgroundColor: bgColor.replace('500', '100').replace('600', '100'), color: bgColor }}>
        {React.cloneElement(icon, { className: "h-6 w-6" })}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {statsLoading ? (
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        ) : statsError ? (
          <p className="text-red-500 text-sm">Error</p>
        ) : (
          <p className="text-2xl font-semibold text-gray-800">{count}</p>
        )}
      </div>
    </div>
  );

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
              onClick={handleLogout}
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="p-2 rounded-full text-white hover:bg-cyan-600"
            >
              <User className="h-6 w-6" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-white focus:outline-none"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
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
                  handleLogout();
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

      {/* Profile Dropdown (Desktop) */}
      {profileOpen && (
        <div
          ref={profileRef}
          className="absolute top-16 right-4 md:right-8 z-20 bg-white rounded-lg shadow-lg w-80 p-6 animate-fade-in"
        >
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-800">Profile Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-gray-800">{user.fullName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-800">{user.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p className="text-gray-800">{user.username || 'N/A'}</p>
            </div>
          </div>
          <button
            onClick={() => setProfileOpen(false)}
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 transition-all duration-200"
          >
            Close
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <div className="md:hidden h-16"></div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Welcome section */}
              <div className="bg-white shadow-md rounded-lg mb-6 p-4 flex flex-wrap justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.fullName || 'Student'}</h1>
                  <p className="text-gray-600">Explore your courses and assessments</p>
                </div>
                <div className="hidden md:block">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="p-2 rounded-full text-cyan-600 hover:bg-cyan-100 transition-all duration-200"
                  >
                    <User className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {renderStatItem(stats.enrolledCourses, 'Enrolled Courses', <BookOpen />, 'rgb(6, 182, 212)')}
                {renderStatItem(stats.completedQuizzes, 'Completed Quizzes', <HelpCircle />, 'rgb(20, 184, 166)')}
                {renderStatItem(stats.pendingQuizzes, 'Pending Quizzes', <Users />, 'rgb(8, 145, 178)')}
              </div>

              {/* Course overview */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Your Enrolled Courses</h2>
                <div className="bg-white overflow-hidden shadow-md rounded-lg divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-cyan-700 to-teal-700">
                    <h3 className="text-lg leading-6 font-medium text-white">Course Overview</h3>
                  </div>
                  {coursesLoading ? (
                    <div className="px-4 py-10 sm:px-6 text-center text-gray-500">
                      <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      Loading courses...
                    </div>
                  ) : coursesError ? (
                    <div className="px-4 py-10 sm:px-6 text-center text-red-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>{coursesError}</p>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          navigate('/login');
                        }}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700"
                      >
                        Return to Login
                      </button>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="px-4 py-10 sm:px-6 text-center text-gray-500">
                      <p>You are not enrolled in any courses yet.</p>
                      <Link
                        to="/student/view-courses"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700"
                      >
                        Explore Courses
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                      {courses.slice(0, 3).map((course) => (
                        <div
                          key={course.id}
                          className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">Instructor: {course.instructorUsername}</p>
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                          <button
                            onClick={() => handleViewQuizzes(course.id)}
                            className="bg-cyan-600 text-white px-3 py-1 rounded text-sm hover:bg-cyan-700 transition-all duration-200"
                          >
                            View Quizzes
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent activity */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h2>
                <div className="bg-white overflow-hidden shadow-md rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Enrolled in Advanced Mathematics</p>
                          <p className="text-sm text-gray-500">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center">
                            <HelpCircle className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Completed Quiz "Algebra Basics"</p>
                          <p className="text-sm text-gray-500">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Received grade for "Calculus Quiz"</p>
                          <p className="text-sm text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;