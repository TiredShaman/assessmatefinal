import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  HelpCircle,
  User,
  CheckCircle,
  Clock,
  Plus,
  X,
} from 'lucide-react';
import authHeader from '../../services/authHeader';
import Sidebar from '../dashboard/Sidebar';

function TeacherDashboard({ user }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState('');
  const [classId, setClassId] = useState('');
  const [teacherStats, setTeacherStats] = useState({
    totalCourses: 0,
    totalQuizzes: 0,
    totalStudents: 0,
    activeQuizzes: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!user || !user.roles || !user.roles.includes("ROLE_TEACHER")) {
      console.log("TeacherDashboard - redirecting to login, user:", user);
      setIsAuthenticated(false);
      localStorage.clear();
      navigate("/login", { state: { message: "Please log in as a teacher." } });
    } else {
      setIsAuthenticated(true);
      fetchClasses();
      fetchTeacherStats();
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

  const fetchClasses = async () => {
    setClassesLoading(true);
    try {
      const headers = authHeader();
      console.log("Fetching classes with headers:", headers);
      const response = await fetch('http://localhost:8080/api/teachers/courses', { headers });
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Fetch classes error:", response.status, errorData);
        throw new Error(errorData || 'Failed to fetch classes');
      }
      const data = await response.json();
      console.log("Classes fetched:", data);
      setClasses(data);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setStatsError('Failed to load classes.');
    } finally {
      setClassesLoading(false);
    }
  };

  const fetchTeacherStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const headers = authHeader();
      console.log("Fetching stats with headers:", headers);
      const endpoints = [
        { url: '/api/teachers/stats/total-courses', key: 'totalCourses' },
        { url: '/api/teachers/stats/total-quizzes', key: 'totalQuizzes' },
        { url: '/api/teachers/stats/total-enrolled-students', key: 'totalStudents' },
        { url: '/api/teachers/stats/active-quizzes', key: 'activeQuizzes' },
      ];
      const results = await Promise.all(
        endpoints.map(async ({ url, key }) => {
          const response = await fetch(`http://localhost:8080${url}`, { headers });
          if (!response.ok) {
            const errorBody = await response.text();
            console.error(`${key} API error:`, response.status, errorBody);
            throw new Error(`Failed to fetch ${key}: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          console.log(`${key} fetched:`, data);
          return { key, count: data.count || 0 };
        })
      );
      const newStats = results.reduce((acc, { key, count }) => ({
        ...acc,
        [key]: count,
      }), {});
      setTeacherStats(newStats);
    } catch (err) {
      console.error('Error fetching teacher stats:', err);
      setStatsError('Failed to load stats.');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    try {
      const headers = authHeader();
      const response = await fetch('http://localhost:8080/api/teachers/enroll-student', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: studentEmail, courseId: classId }),
      });
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Enroll student error:", response.status, errorData);
        throw new Error(errorData || 'Failed to enroll student');
      }
      setMessage('Student enrolled successfully!');
      setEnrollModalOpen(false);
      setStudentEmail('');
      setClassId('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error enrolling student:', err);
      setMessage('Failed to enroll student.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const renderStatItem = (count, label, icon, bgColor) => (
    <div className="relative bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex items-center">
        <div className={`flex-shrink-0 p-4 rounded-full`} style={{ backgroundColor: `${bgColor}20`, color: bgColor }}>
          {React.cloneElement(icon, { className: "h-10 w-10" })}
        </div>
        <div className="ml-5">
          <p className="text-sm font-semibold text-gray-600 tracking-wide uppercase">{label}</p>
          {statsLoading ? (
            <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mt-2"></div>
          ) : statsError ? (
            <p className="text-red-600 text-sm font-medium mt-2">Error</p>
          ) : (
            <p className="text-4xl font-extrabold text-gray-900 mt-1">{count}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex font-sans antialiased">
      <Sidebar user={user} activeItem="dashboard" onLogout={handleLogout} />

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-80">
        <div className="md:hidden h-16"></div>
        <main className="flex-1">
          <div className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Welcome and notification bar */}
              <div className="bg-white shadow-2xl rounded-3xl mb-10 p-8 flex flex-wrap justify-between items-center transform transition-all duration-500 animate-fade-in">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome, {user?.fullName || 'Teacher'}</h1>
                  <p className="text-gray-600 mt-2 text-lg font-medium">Seamlessly manage your classes and assessments</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  {message && (
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-2xl flex items-center animate-pulse">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm font-semibold">{message}</span>
                    </div>
                  )}
                  <div className="hidden md:block">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="p-3 rounded-full text-cyan-600 hover:bg-cyan-100 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <User className="h-8 w-8" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  ref={profileRef}
                  className="absolute top-20 right-6 md:right-10 z-30 bg-white rounded-3xl shadow-2xl w-96 p-8 transform transition-all duration-500 animate-slide-down"
                >
                  <div className="flex items-center mb-6">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="ml-4 text-2xl font-bold text-gray-900 tracking-tight">Profile</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Full Name</p>
                      <p className="text-gray-900 text-lg font-medium mt-1">{user.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Email</p>
                      <p className="text-gray-900 text-lg font-medium mt-1">{user.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Username</p>
                      <p className="text-gray-900 text-lg font-medium mt-1">{user.username || 'N/A'}</p>
                    </div>
                    <button
                      onClick={() => setProfileOpen(false)}
                      className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-2xl text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-md"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Stats overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {renderStatItem(teacherStats.totalStudents, 'Total Students', <Users />, '#06B6D4')}
                {renderStatItem(teacherStats.totalCourses, 'Total Classes', <BookOpen />, '#14B8A6')}
                {renderStatItem(teacherStats.totalQuizzes, 'Total Quizzes', <HelpCircle />, '#0891B2')}
                {renderStatItem(teacherStats.activeQuizzes, 'Active Quizzes', <Clock />, '#0D9488')}
              </div>

              {/* Class overview */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Your Classes</h2>
                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                  <div className="px-6 py-5 bg-gradient-to-r from-cyan-800 to-teal-800">
                    <h3 className="text-xl font-semibold text-white">Class Overview</h3>
                  </div>
                  {classesLoading ? (
                    <div className="px-6 py-16 text-center text-gray-500">
                      <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-lg font-medium">Loading classes...</p>
                    </div>
                  ) : classes.length === 0 ? (
                    <div className="px-6 py-16 text-center text-gray-500">
                      <p className="text-lg font-medium mb-6">No classes found. Create your first class!</p>
                      <Link
                        to="/create-class"
                        className="inline-flex items-center px-6 py-3 text-base font-medium rounded-2xl text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-md transition-all duration-300"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Create Class
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-72 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 shadow-sm">
                          <tr>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Course Code
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Students
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {classes.slice(0, 3).map((cls, index) => (
                            <tr key={cls.id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-cyan-50`}>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <div className="font-semibold text-gray-900 text-lg">{cls.code}</div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <div className="text-sm text-gray-600">{cls.enrolledStudentsCount} students</div>
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm">
                                <Link to={`/class-details/${cls.id}`} className="text-cyan-600 hover:text-cyan-800 font-semibold mr-4 transition-colors duration-200">View</Link>
                                <button className="text-cyan-600 hover:text-cyan-800 font-semibold transition-colors duration-200">Manage</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent activity */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Recent Activity</h2>
                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                  <div className="px-6 py-8">
                    <div className="space-y-8">
                      <div className="flex items-start transform transition-all duration-300 hover:-translate-y-1">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-5">
                          <p className="text-base font-semibold text-gray-900">New student joined Advanced Mathematics</p>
                          <p className="text-sm text-gray-500 mt-1">1 hour ago</p>
                        </div>
                      </div>
                      <div className="flex items-start transform transition-all duration-300 hover:-translate-y-1">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
                            <HelpCircle className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-5">
                          <p className="text-base font-semibold text-gray-900">Quiz "Algebra Review" completed by 18 students</p>
                          <p className="text-sm text-gray-500 mt-1">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-start transform transition-all duration-300 hover:-translate-y-1">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-cyan-600 flex items-center justify-center shadow-lg">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-5">
                          <p className="text-base font-semibold text-gray-900">Created new class "Computer Science"</p>
                          <p className="text-sm text-gray-500 mt-1">2 days ago</p>
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

      {/* Enroll Student Modal */}
      {enrollModalOpen && (
        <div className="fixed z-40 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80 transition-opacity duration-500" onClick={() => setEnrollModalOpen(false)}></div>
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 max-w-lg w-full animate-slide-up">
              <div className="bg-gradient-to-r from-cyan-800 to-teal-800 px-6 py-5 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white tracking-tight">Enroll Student</h3>
                <button onClick={() => setEnrollModalOpen(false)} className="text-white hover:text-cyan-200 transition-colors duration-200">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleEnrollStudent} className="p-8">
                <div className="space-y-8">
                  <div>
                    <label htmlFor="student-email" className="block text-sm font-semibold text-gray-700 tracking-wide">
                      Student Email
                    </label>
                    <input
                      type="email"
                      id="student-email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                      className="mt-3 block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="student@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="class-select" className="block text-sm font-semibold text-gray-700 tracking-wide">
                      Select Class
                    </label>
                    <select
                      id="class-select"
                      value={classId}
                      onChange={(e) => setClassId(e.target.value)}
                      required
                      className="mt-3 block w-full px-5 py-4 border border-gray-200 bg-gray-50 rounded-2xl shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                    >
                      <option value="">Select a class</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-10 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEnrollModalOpen(false)}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-2xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                  >
                    Enroll Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;