import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Plus,
  Eye,
  UserPlus,
  HelpCircle,
  BookOpen,
  LogOut,
  Menu,
  X,
  Award,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function Sidebar({ user, activeItem, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const navItems = [
    {
      to: '/teacher/dashboard',
      label: 'Dashboard',
      icon: <Home className="mr-4 h-6 w-6 text-cyan-300 group-hover:scale-110 transition-transform duration-200" />,
      id: 'dashboard',
    },
    {
      to: '/create-class',
      label: 'Create Class',
      icon: <Plus className="mr-4 h-6 w-6 text-cyan-300 group-hover:scale-110 transition-transform duration-200" />,
      id: 'create-class',
    },
    {
      to: '/view-classes',
      label: 'View Classes',
      icon: <Eye className="mr-4 h-6 w-6 text-cyan-300 group-hover:scale-110 transition-transform duration-200" />,
      id: 'view-classes',
    },
    {
      to: '/enroll-student',
      label: 'Enroll Student',
      icon: <UserPlus className="mr-4 h-6 w-6 text-cyan-300 group-hover:scale-110 transition-transform duration-200" />,
      id: 'enroll-student',
    },
    {
      to: '/teacher/create-quiz',
      label: 'Create Quiz',
      icon: <HelpCircle className="mr-4 h-6 w-6 text-cyan-300 group-hover:scale-110 transition-transform duration-200" />,
      id: 'create-quiz',
    },
    {
      to: '/teacher/view-quizzes',
      label: 'View Quizzes',
      icon: <BookOpen className="mr-4 h-6 w-6 text-cyan-300 group-hover:scale-110 transition-transform duration-200" />,
      id: 'view-quizzes',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (profileOpen) setProfileOpen(false);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden bg-gradient-to-r from-cyan-700 to-teal-700 z-30 fixed w-full h-16 shadow-2xl">
        <div className="flex justify-between items-center h-full px-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg ring-2 ring-cyan-300">
              <Award className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-extrabold text-white tracking-tight">AssessMate</span>
          </div>
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-full text-white hover:bg-cyan-600 hover:bg-opacity-70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:flex-col md:w-80 md:fixed md:inset-y-0 z-20 animate-fade-in">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-cyan-800 to-teal-800 bg-opacity-95 shadow-2xl">
          <div className="flex items-center h-16 px-6 bg-gradient-to-r from-cyan-700 to-teal-700 shadow-lg mb-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg ring-2 ring-cyan-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <span className="ml-4 text-2xl font-extrabold text-white tracking-tight">AssessMate</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            {/* User Profile Section */}
            <div className="px-4 mb-6">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center px-4 py-3 text-white bg-cyan-700 bg-opacity-70 rounded-2xl hover:bg-cyan-600 hover:bg-opacity-70 transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3 text-left flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user?.fullName || 'Teacher'}</p>
                  <p className="text-xs text-cyan-200 truncate">{user?.email || 'N/A'}</p>
                </div>
                {profileOpen ? (
                  <ChevronUp className="h-5 w-5 text-cyan-300" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-cyan-300" />
                )}
              </button>
              {profileOpen && (
                <div
                  ref={profileRef}
                  className="mt-2 bg-white rounded-2xl shadow-lg p-4 transition-all duration-300 animate-slide-down"
                >
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Full Name</p>
                      <p className="text-sm font-medium text-gray-900">{user?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Email</p>
                      <p className="text-sm font-medium text-gray-900">{user?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Username</p>
                      <p className="text-sm font-medium text-gray-900">{user?.username || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <nav className="flex-1 px-4 space-y-3">
              {navItems.map((item) => (
                <div key={item.id}>
                  <Link
                    to={item.to}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.3 hover:shadow-md ${
                      item.id === activeItem
                        ? 'bg-cyan-600 bg-opacity-80 text-white shadow-cyan-500/20 shadow-md'
                        : 'text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-60'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-cyan-700">
            <button
              onClick={onLogout}
              className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-2xl text-white bg-red-600 hover:bg-red-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.3"
            >
              <LogOut className="mr-4 h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-gray-900 bg-opacity-90 backdrop-blur-md transition-opacity duration-500">
          <div
            className={`fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-cyan-800 to-teal-800 bg-opacity-95 shadow-2xl transform transition-transform duration-500 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="h-16"></div>
            <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
              {/* User Profile Section */}
              <div className="px-4 mb-6">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-full flex items-center px-4 py-3 text-white bg-cyan-700 bg-opacity-70 rounded-2xl hover:bg-cyan-600 hover:bg-opacity-70 transition-all duration-300"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3 text-left flex-1">
                    <p className="text-sm font-semibold text-white truncate">{user?.fullName || 'Teacher'}</p>
                    <p className="text-xs text-cyan-200 truncate">{user?.email || 'N/A'}</p>
                  </div>
                  {profileOpen ? (
                    <ChevronUp className="h-5 w-5 text-cyan-300" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-cyan-300" />
                  )}
                </button>
                {profileOpen && (
                  <div
                    ref={profileRef}
                    className="mt-2 bg-white rounded-2xl shadow-lg p-4 transition-all duration-300 animate-slide-down"
                  >
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Full Name</p>
                        <p className="text-sm font-medium text-gray-900">{user?.fullName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Email</p>
                        <p className="text-sm font-medium text-gray-900">{user?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Username</p>
                        <p className="text-sm font-medium text-gray-900">{user?.username || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <nav className="flex-1 px-4 space-y-3">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <Link
                      to={item.to}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.3 hover:shadow-md ${
                        item.id === activeItem
                          ? 'bg-cyan-600 bg-opacity-80 text-white shadow-cyan-500/20 shadow-md'
                          : 'text-cyan-100 hover:text-white hover:bg-cyan-600 hover:bg-opacity-60'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-cyan-700">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  onLogout();
                }}
                className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-2xl text-white bg-red-600 hover:bg-red-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.3"
              >
                <LogOut className="mr-4 h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;