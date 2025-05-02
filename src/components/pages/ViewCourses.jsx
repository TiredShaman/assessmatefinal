import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authHeader from '../../services/authHeader';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  ChevronRight,
  Users,
  AlertCircle,
  Edit,
  Trash2,
  User,
  CheckCircle,
  X,
} from 'lucide-react';
import Sidebar from '../dashboard/Sidebar';

function ViewCourses({ user }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [editCourseId, setEditCourseId] = useState(null);
  const [message, setMessage] = useState('');
  const profileRef = useRef(null);

  useEffect(() => {
    if (!user || !user.roles || !user.roles.includes('ROLE_TEACHER')) {
      console.warn("User not logged in or does not have teacher role. Redirecting to login.");
      localStorage.clear();
      navigate('/login', { state: { message: 'Please log in as a teacher to view this page.' } });
    } else {
      setIsAuthenticated(true);
      fetchCourses();
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const headers = authHeader();
      const response = await fetch('http://localhost:8080/api/teachers/courses', {
        method: 'GET',
        headers,
      });

      if (response.status === 401 || response.status === 403) {
        console.error(`Authentication/Authorization error: Status ${response.status}`);
        localStorage.clear();
        navigate('/login', { state: { message: 'Session expired or insufficient permissions. Please log in again.' } });
        throw new Error('Authentication or authorization failed.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch courses with status ${response.status}`);
      }

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch courses';
      console.error('Error fetching courses:', err);
      if (!errorMessage.includes('Authentication or authorization failed.')) {
        setError(errorMessage);
        toast.error(errorMessage, { className: 'bg-red-100 text-red-800 rounded-xl' });
      }
    } finally {
      if (!window.location.pathname.includes('/login')) {
        setLoading(false);
      }
    }
  };

  const handleEditCourse = (course, event) => {
    event.stopPropagation();
    setEditCourseId(course.id);
    setCourseTitle(course.title);
    setCourseCode(course.code);
    setCourseDescription(course.description || '');
    setEditModalOpen(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const headers = authHeader();
      console.log("Updating course with ID:", editCourseId);
      const response = await fetch(`http://localhost:8080/api/teachers/courses/${editCourseId}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: courseTitle, description: courseDescription, code: courseCode }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Update course error:', response.status, errorData);
        throw new Error(errorData || 'Failed to update course');
      }

      setMessage('Course updated successfully!');
      setEditModalOpen(false);
      setCourseTitle('');
      setCourseDescription('');
      setCourseCode('');
      setEditCourseId(null);
      fetchCourses();
      toast.success('Course updated successfully!', {
        className: 'bg-green-100 text-green-800 rounded-xl',
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating course:', err);
      setMessage('Failed to update course.');
      toast.error('Failed to update course.', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteCourse = async (courseId, event) => {
    event.stopPropagation();
    const isConfirmed = window.confirm(`Are you sure you want to delete this course? This action cannot be undone.`);
    if (!isConfirmed) return;

    try {
      const headers = authHeader();
      console.log("Deleting course with ID:", courseId);
      const response = await fetch(`http://localhost:8080/api/teachers/courses/${courseId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete course with status ${response.status}`);
      }

      setCourses(courses.filter((course) => course.id !== courseId));
      toast.success('Course deleted successfully!', {
        className: 'bg-green-100 text-green-800 rounded-xl',
      });
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete course';
      console.error('Error deleting course:', err);
      toast.error(errorMessage, { className: 'bg-red-100 text-red-800 rounded-xl' });
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const headers = authHeader();
      const response = await fetch('http://localhost:8080/api/teachers/courses', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: courseTitle, description: courseDescription, code: courseCode }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Create course error:', response.status, errorData);
        throw new Error(errorData || 'Failed to create course');
      }

      setMessage('Course created successfully!');
      setCreateModalOpen(false);
      setCourseTitle('');
      setCourseDescription('');
      setCourseCode('');
      fetchCourses();
      toast.success('Course deployed successfully!', {
        className: 'bg-green-100 text-green-800 rounded-xl',
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error creating course:', err);
      setMessage('Failed to create course.');
      toast.error('Failed to deploy course.', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const mockStats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum, course) => sum + (course.numberOfEnrolledStudents || 0), 0),
  };

  const renderStatItem = (count, label, icon, bgColor) => (
    <div className="relative bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 group overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative flex items-center">
        <div className={`flex-shrink-0 p-4 rounded-full`} style={{ backgroundColor: `${bgColor}20`, color: bgColor }}>
          {React.cloneElement(icon, { className: 'h-10 w-10' })}
        </div>
        <div className="ml-5">
          <p className="text-sm font-semibold text-gray-600 tracking-wide uppercase">{label}</p>
          {loading ? (
            <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mt-2"></div>
          ) : error ? (
            <p className="text-red-600 text-sm font-medium mt-2">Error</p>
          ) : (
            <p className="text-4xl font-extrabold text-gray-900 mt-1">{count}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans antialiased flex">
      <Sidebar user={user} activeItem="view-classes" onLogout={handleLogout} />

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
                  className="absolute top-20 right-6 md:right-10 z-30 bg-white rounded-3xl shadow-2xl w-96 p-8 transform transition-all duration-500 animate-slide-up"
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
                {renderStatItem(mockStats.totalCourses, 'Total Courses', <BookOpen />, '#06B6D4')}
                {renderStatItem(mockStats.totalStudents, 'Total Students', <Users />, '#14B8A6')}
              </div>

              {/* Course list */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Your Classes</h2>
                {loading ? (
                  <div className="text-center py-16 bg-white rounded-3xl shadow-2xl">
                    <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-600">Loading classes...</p>
                  </div>
                ) : error && !error.includes('Authentication or authorization failed.') ? (
                  <div className="bg-white border border-red-200 rounded-3xl p-8 text-center shadow-2xl animate-glitch">
                    <AlertCircle className="h-20 w-20 text-red-600 mx-auto mb-6" />
                    <p className="text-red-600 text-xl font-medium mb-6">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300"
                    >
                      Retry Connection
                    </button>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl shadow-2xl animate-fade-in">
                    <BookOpen size={100} className="text-cyan-600 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">No Classes Found</h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">Create your first class to get started.</p>
                    <button
                      onClick={() => setCreateModalOpen(true)}
                      className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white text-xl font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                    >
                      <Plus size={28} className="mr-3" />
                      Create First Class
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 group animate-fade-in"
                        onClick={() => navigate(`/teacher/courses/${course.id}`)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-8 border-2 border-transparent group-hover:border-cyan-600 transition-all duration-300">
                          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight line-clamp-1">{course.title}</h2>
                          <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{course.description || 'No description available.'}</p>
                          <div className="flex items-center text-gray-600 text-sm mb-8">
                            <Users size={20} className="mr-3 text-cyan-600" />
                            <span className="font-medium">{course.numberOfEnrolledStudents || 0} Users</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-6">
                              <button
                                className="p-3 rounded-full text-cyan-600 hover:bg-cyan-100 hover:text-cyan-800 transition-all duration-200 transform hover:scale-125"
                                onClick={(event) => handleEditCourse(course, event)}
                                title="Modify Course"
                              >
                                <Edit size={22} />
                              </button>
                              <button
                                className="p-3 rounded-full text-red-600 hover:bg-red-100 hover:text-red-800 transition-all duration-200 transform hover:scale-125"
                                onClick={(event) => handleDeleteCourse(course.id, event)}
                                title="Delete Course"
                              >
                                <Trash2 size={22} />
                              </button>
                            </div>
                            <button className="inline-flex items-center text-cyan-600 hover:text-cyan-800 font-semibold text-sm transition-all duration-200">
                              Access Details
                              <ChevronRight size={18} className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent activity */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Recent Activity</h2>
                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
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
                          <p className="text-sm text-gray-600 mt-1">1 hour ago</p>
                        </div>
                      </div>
                      <div className="flex items-start transform transition-all duration-300 hover:-translate-y-1">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-teal-500 flex items-center justify-center shadow-lg">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-5">
                          <p className="text-base font-semibold text-gray-900">Created new class "Computer Science"</p>
                          <p className="text-sm text-gray-600 mt-1">2 days ago</p>
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

      {/* Create Course Modal */}
      {createModalOpen && (
        <div className="fixed z-40 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-80 transition-opacity duration-500"
              onClick={() => setCreateModalOpen(false)}
            ></div>
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 max-w-lg w-full animate-slide-up">
              <div className="bg-gradient-to-r from-cyan-800 to-teal-800 px-6 py-5 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white tracking-tight">Create Class</h3>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="text-white hover:text-cyan-200 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleCreateCourse} className="p-8">
                <div className="space-y-8">
                  <div>
                    <label htmlFor="course-title" className="block text-sm font-semibold text-gray-700 tracking-wide">
                      Class Title
                    </label>
                    <input
                      type="text"
                      id="course-title"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      required
                      className="mt-3 block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="e.g., Advanced Mathematics"
                    />
                  </div>
                  <div>
                    <label htmlFor="course-code" className="block text-sm font-semibold text-gray-700 tracking-wide">
                      Class Code
                    </label>
                    <input
                      type="text"
                      id="course-code"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      required
                      className="mt-3 block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="e.g., MATH101"
                    />
                  </div>
                  <div>
                    <label htmlFor="course-description" className="block text-sm font-semibold text-gray-700 tracking-wide">
                      Description
                    </label>
                    <textarea
                      id="course-description"
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      className="mt-3 block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="Brief class description..."
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-10 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-2xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                  >
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editModalOpen && (
        <div className="fixed z-40 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-80 transition-opacity duration-500"
              onClick={() => setEditModalOpen(false)}
            ></div>
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 max-w-lg w-full animate-slide-up">
              <div className="bg-gradient-to-r from-cyan-800 to-teal-800 px-6 py-5 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white tracking-tight">Edit Class</h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-white hover:text-cyan-200 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleUpdateCourse} className="p-8">
                <div className="िस्ट space-y-8">
                  <div>
                    <label htmlFor="edit-course-title" className="block text-sm font-semibold text-gray-700 tracking-wide">
                      Class Title
                    </label>
                    <input
                      type="text"
                      id="edit-course-title"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      required
                      className="mt-3 block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="e.g., Advanced Mathematics"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-course-code" className="block text-sm font-semibold text-gray-700 tracking-wide">
                      Class Code
                    </label>
                    <input
                      type="text"
                      id="edit-course-code"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      required
                      className="mt-3 block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="e.g., MATH101"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-course-description" className="block text-sm font-semibold text-gray-700 tracking-wide">
                      Description
                    </label>
                    <textarea
                      id="edit-course-description"
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      className="mt-3 block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all duration-300 hover:shadow-md"
                      placeholder="Brief class description..."
                      rows="4"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-10 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-2xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                  >
                    Update Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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

export default ViewCourses;
