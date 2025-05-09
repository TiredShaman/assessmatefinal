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

  const handleLogout = () => {
    setSidebarOpen(false);
    localStorage.clear();
    sessionStorage.clear();
    onLogout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile header with improved glass effect */}
      <div className="md:hidden bg-gradient-to-r from-cyan-700 to-teal-700 z-30 fixed w-full h-16 shadow-2xl backdrop-filter backdrop-blur-lg bg-opacity-90">
        <div className="flex justify-between items-center h-full px-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg ring-2 ring-cyan-300 ring-opacity-50">
              <Award className="h-6 w-6 text-white drop-shadow-md" />
            </div>
            <span className="ml-3 text-xl font-extrabold text-white tracking-tight drop-shadow-md">
              AssessMate
              <span className="text-cyan-200 text-xs font-light ml-1">TEACHER</span>
            </span>
          </div>
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-full text-white hover:bg-cyan-600 hover:bg-opacity-70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-cyan-400 border-opacity-30"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Enhanced desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-80 md:fixed md:inset-y-0 z-20">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-cyan-800 to-teal-800 shadow-2xl">
          {/* Header with subtle glow effect */}
          <div className="flex items-center h-20 px-6 bg-gradient-to-r from-cyan-700 to-teal-700 shadow-lg mb-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-xl ring-2 ring-cyan-300 ring-opacity-70 relative">
                <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-20 blur-md"></div>
                <Award className="h-8 w-8 text-white drop-shadow-md relative z-10" />
              </div>
              <div className="ml-4">
                <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">AssessMate</span>
                <div className="text-xs font-medium text-cyan-200 tracking-wider uppercase mt-1">Teacher Portal</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-700 scrollbar-track-transparent">
            {/* Enhanced User Profile Section */}
            <div className="px-5 mb-6">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center p-4 text-white bg-gradient-to-r from-cyan-700 to-cyan-600 rounded-2xl hover:from-cyan-600 hover:to-cyan-500 transition-all duration-300 border border-cyan-500 border-opacity-30 shadow-md"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-md p-0.5">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center shadow-inner">
                    <User className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 text-left flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user?.fullName || 'Teacher'}</p>
                  <p className="text-xs text-cyan-200 truncate">{user?.email || 'N/A'}</p>
                </div>
                {profileOpen ? (
                  <ChevronUp className="h-5 w-5 text-cyan-300" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-cyan-300" />
                )}
              </button>
              
              {/* Enhanced profile dropdown with card effect */}
              {profileOpen && (
                <div
                  ref={profileRef}
                  className="mt-3 bg-white rounded-2xl shadow-xl p-5 transition-all duration-300 border border-cyan-300 border-opacity-30"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center shadow-md">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs font-semibold text-cyan-800 tracking-wide uppercase">Full Name</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{user?.fullName || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs font-semibold text-cyan-800 tracking-wide uppercase">Email</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{user?.email || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs font-semibold text-cyan-800 tracking-wide uppercase">Username</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{user?.username || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced navigation with floating effect */}
            <nav className="flex-1 px-4 space-y-2.5">
              {navItems.map((item) => (
                <div key={item.id}>
                  <Link
                    to={item.to}
                    className={`group flex items-center px-5 py-3.5 font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg ${
                      item.id === activeItem
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-700/30'
                        : 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-600 hover:shadow-cyan-700/20'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    {item.id === activeItem && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-cyan-300"></div>
                    )}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
          
          {/* Enhanced logout button */}
          <div className="p-5 border-t border-cyan-700">
            <button
              onClick={handleLogout}
              className="w-full group flex items-center px-5 py-3.5 font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md border border-red-400 border-opacity-30"
            >
              <LogOut className="mr-4 h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-md transition-opacity duration-500">
          <div
            className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-cyan-800 to-teal-800 shadow-2xl transform transition-transform duration-500 translate-x-0 overflow-y-auto"
          >
            <div className="h-16"></div> {/* Space for header */}
            
            {/* User profile section */}
            <div className="pt-8 pb-4">
              <div className="px-5 mb-6">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-full flex items-center p-4 text-white bg-gradient-to-r from-cyan-700 to-cyan-600 rounded-2xl hover:from-cyan-600 hover:to-cyan-500 transition-all duration-300 border border-cyan-500 border-opacity-30 shadow-md"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-md">
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
                
                {/* Enhanced mobile profile dropdown */}
                {profileOpen && (
                  <div
                    ref={profileRef}
                    className="mt-3 mx-5 bg-white rounded-2xl shadow-xl p-4 transition-all duration-300 border border-cyan-300 border-opacity-30"
                  >
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-2.5 rounded-xl">
                        <p className="text-xs font-semibold text-cyan-800 tracking-wide uppercase">Full Name</p>
                        <p className="text-sm font-medium text-gray-900">{user?.fullName || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded-xl">
                        <p className="text-xs font-semibold text-cyan-800 tracking-wide uppercase">Email</p>
                        <p className="text-sm font-medium text-gray-900">{user?.email || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded-xl">
                        <p className="text-xs font-semibold text-cyan-800 tracking-wide uppercase">Username</p>
                        <p className="text-sm font-medium text-gray-900">{user?.username || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced mobile navigation */}
              <nav className="px-4 space-y-2">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <Link
                      to={item.to}
                      className={`group flex items-center px-4 py-3 font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg ${
                        item.id === activeItem
                          ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-700/30'
                          : 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-600 hover:shadow-cyan-700/20'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                      {item.id === activeItem && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-cyan-300"></div>
                      )}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>
            
            {/* Enhanced mobile logout button */}
            <div className="p-4 border-t border-cyan-700 mt-4">
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-4 py-3 font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-md border border-red-400 border-opacity-30"
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