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
  Activity,
  Calendar,
  ArrowRight,
  ChevronRight,
  Bell,
} from 'lucide-react';
import authHeader from '../../services/authHeader';
import Sidebar from '../dashboard/Sidebar';
import config from '../../config/config.js';

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
      const response = await fetch(`${config.API_URL}/api/teachers/courses`, { headers });
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
          const response = await fetch(`https://assessmate-j21k.onrender.com${url}`, { headers });
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
    setIsAuthenticated(false);
    setTeacherStats({
      totalCourses: 0,
      totalQuizzes: 0,
      totalStudents: 0,
      activeQuizzes: 0,
    });
    setClasses([]);
    localStorage.clear();
    sessionStorage.clear();
    
    // Use window.location.href instead of navigate
    window.location.href = '/login';
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    try {
      const headers = authHeader();
      const response = await fetch(`${config.API_URL}/api/teachers/enroll-student`, {
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
      <div className="absolute top-0 right-0 h-32 w-32 -mr-10 -mt-10 bg-gradient-to-br from-transparent to-cyan-100 opacity-30 rounded-full"></div>
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
              <div className="bg-white shadow-2xl rounded-3xl mb-10 p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-100 to-transparent rounded-full -mr-24 -mt-24 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-100 to-transparent rounded-full -ml-16 -mb-16 opacity-50"></div>
                
                <div className="relative flex flex-wrap justify-between items-center transform transition-all duration-500 animate-fade-in">
                  <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome, {user?.fullName || 'Teacher'}</h1>
                    <p className="text-gray-600 mt-2 text-lg font-medium">Seamlessly manage your classes and assessments</p>
                    <div className="mt-4 flex items-center">
                      <Calendar className="h-5 w-5 text-cyan-600 mr-2" />
                      <span className="text-sm font-medium text-gray-500">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    {message && (
                      <div className="px-4 py-2 bg-green-100 text-green-800 rounded-2xl flex items-center animate-pulse shadow-md">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="text-sm font-semibold">{message}</span>
                      </div>
                    )}
                    <div className="hidden md:flex space-x-2">
                      <button
                        className="p-3 rounded-full text-cyan-600 hover:bg-cyan-100 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 relative"
                      >
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
                      </button>
                      <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="p-3 rounded-full text-cyan-600 hover:bg-cyan-100 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <User className="h-6 w-6" />
                      </button>
                    </div>
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
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Profile</h3>
                      <p className="text-cyan-600 text-sm font-medium">Teacher Account</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Full Name</p>
                      <p className="text-gray-900 text-lg font-medium mt-1">{user.fullName || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Email</p>
                      <p className="text-gray-900 text-lg font-medium mt-1">{user.email || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Username</p>
                      <p className="text-gray-900 text-lg font-medium mt-1">{user.username || 'N/A'}</p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setProfileOpen(false)}
                        className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-2xl text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300 shadow-md"
                      >
                        Close
                      </button>
                      <button
                        className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-2xl border border-cyan-600 text-cyan-600 hover:bg-cyan-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                {/* Stats overview */}
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight flex items-center">
                    <Activity className="h-7 w-7 text-cyan-600 mr-2" />
                    Dashboard Overview
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {renderStatItem(teacherStats.totalStudents, 'Total Students', <Users />, '#06B6D4')}
                    {renderStatItem(teacherStats.totalCourses, 'Total Classes', <BookOpen />, '#14B8A6')}
                    {renderStatItem(teacherStats.totalQuizzes, 'Total Quizzes', <HelpCircle />, '#0891B2')}
                    {renderStatItem(teacherStats.activeQuizzes, 'Active Quizzes', <Clock />, '#0D9488')}
                  </div>
                </div>

                {/* Quick actions */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight flex items-center">
                    <Plus className="h-7 w-7 text-cyan-600 mr-2" />
                    Quick Actions
                  </h2>
                  <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
                    <div className="p-6 space-y-4">
                      <Link 
                        to="/create-class" 
                        className="block p-5 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl shadow-sm flex items-center justify-between transform transition-all duration-300 hover:translate-x-2 hover:shadow-md"
                      >
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold text-gray-900">Create New Class</h3>
                            <p className="text-sm text-gray-600">Set up a new course</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-cyan-600" />
                      </Link>

                      <Link 
                        to="/create-quiz" 
                        className="block p-5 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl shadow-sm flex items-center justify-between transform transition-all duration-300 hover:translate-x-2 hover:shadow-md"
                      >
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                            <HelpCircle className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold text-gray-900">Create New Quiz</h3>
                            <p className="text-sm text-gray-600">Design an assessment</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-cyan-600" />
                      </Link>

                      <button 
                        onClick={() => setEnrollModalOpen(true)}
                        className="w-full p-5 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl shadow-sm flex items-center justify-between transform transition-all duration-300 hover:translate-x-2 hover:shadow-md"
                      >
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4 text-left">
                            <h3 className="font-semibold text-gray-900">Enroll Students</h3>
                            <p className="text-sm text-gray-600">Add students to a class</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-cyan-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Class overview */}
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight flex items-center">
                    <BookOpen className="h-7 w-7 text-cyan-600 mr-2" />
                    Your Classes
                  </h2>
                  <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                    <div className="px-6 py-5 bg-gradient-to-r from-cyan-800 to-teal-800 flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-white">Class Overview</h3>
                      <Link
                        to="/classes"
                        className="text-cyan-100 hover:text-white text-sm font-medium flex items-center transition-colors duration-200"
                      >
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                    {classesLoading ? (
                      <div className="px-6 py-16 text-center text-gray-500">
                        <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-lg font-medium">Loading classes...</p>
                      </div>
                    ) : classes.length === 0 ? (
                      <div className="px-6 py-16 text-center text-gray-500">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
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
                      <div className="overflow-x-auto max-h-96 overflow-y-auto">
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
                                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                                    <Users className="h-4 w-4 mr-1" />
                                    {cls.enrolledStudentsCount} students
                                  </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm">
                                  <div className="flex space-x-3">
                                    <Link 
                                      to={`/class-details/${cls.id}`} 
                                      className="px-3 py-1 bg-cyan-100 text-cyan-600 rounded-lg hover:bg-cyan-200 transition-colors duration-200 font-medium"
                                    >
                                      View
                                    </Link>
                                    <button 
                                      className="px-3 py-1 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200 transition-colors duration-200 font-medium"
                                    >
                                      Manage
                                    </button>
                                  </div>
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight flex items-center">
                    <Clock className="h-7 w-7 text-cyan-600 mr-2" />
                    Recent Activity
                  </h2>
                  <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                    <div className="px-6 py-5 bg-gradient-to-r from-cyan-800 to-teal-800 flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-white">Activity Feed</h3>
                      <button className="text-cyan-100 hover:text-white text-sm font-medium flex items-center transition-colors duration-200">
                        Refresh <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                    <div className="px-6 py-6">
                      <div className="space-y-6">
                        <div className="relative pl-8 transform transition-all duration-300 hover:-translate-y-1">
                          <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-600 to-teal-500"></div>
                          <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg -translate-x-1/2">
                            <Users className="h-3 w-3 text-white" />
                          </div>
                          <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 rounded-xl">
                            <p className="text-base font-semibold text-gray-900">New student joined Advanced Mathematics</p>
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              1 hour ago
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative pl-8 transform transition-all duration-300 hover:-translate-y-1">
                          <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-teal-600 to-cyan-500"></div>
                          <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-teal-500 flex items-center justify-center shadow-lg -translate-x-1/2">
                            <HelpCircle className="h-3 w-3 text-white" />
                          </div>
                          <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-xl">
                            <p className="text-base font-semibold text-gray-900">Quiz "Algebra Review" completed by 18 students</p>
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Yesterday
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative pl-8 transform transition-all duration-300 hover:-translate-y-1">
                          <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-700 to-cyan-500"></div>
                          <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-cyan-600 flex items-center justify-center shadow-lg -translate-x-1/2">
                            <BookOpen className="h-3 w-3 text-white" />
                          </div>
                          <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 rounded-xl">
                            <p className="text-base font-semibold text-gray-900">Created new class "Computer Science"</p>
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              2 days ago
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-center">
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-cyan-600 hover:bg-cyan-50 transition-colors duration-200">
                          View All Activities <ArrowRight className="ml-1 h-4 w-4" />
                        </button>
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
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 max-w-lg w-full animate-slide-up relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-100 to-transparent rounded-full -mr-24 -mt-24 opacity-30 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-100 to-transparent rounded-full -ml-24 -mb-24 opacity-30 pointer-events-none"></div>
              
              <div className="bg-gradient-to-r from-cyan-800 to-teal-800 px-6 py-5 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white tracking-tight flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Enroll Student
                </h3>
                <button 
                  onClick={() => setEnrollModalOpen(false)} 
                  className="text-white hover:text-cyan-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-10"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleEnrollStudent} className="p-8 relative">
                <div className="space-y-8">
                  <div>
                    <label htmlFor="student-email" className="block text-sm font-semibold text-gray-700 tracking-wide">
                      Student Email
                    </label>
                    <div className="mt-3 relative rounded-2xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="student-email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        required
                        className="block w-full pl-12 pr-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                        placeholder="student@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="class-select" className="block text-sm font-semibold text-gray-700 tracking-wide">
                      Select Class
                    </label>
                    <div className="mt-3 relative rounded-2xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="class-select"
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        required
                        className="block w-full pl-12 pr-5 py-4 border border-gray-200 bg-gray-50 rounded-2xl shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                      >
                        <option value="">Select a class</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>{cls.code} - {cls.name || 'Unnamed Class'}</option>
                        ))}
                      </select>
                    </div>
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