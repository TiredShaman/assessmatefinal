import React, { useState, useEffect } from 'react';
import authHeader from '../../services/authHeader';
import { useNavigate, Link } from 'react-router-dom';
import { HelpCircle, Clock, ChevronRight, Eye, Plus, ToggleLeft, ToggleRight, BookOpen, Edit, Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../dashboard/Sidebar';

function ViewQuizzes({ user }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !Array.isArray(user.roles) || !user.roles.includes('ROLE_TEACHER')) {
      console.log('ViewQuizzes - redirecting to login');
      localStorage.clear();
      navigate('/login', { state: { message: 'Please log in as a teacher to access this page.' } });
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const headers = authHeader();
        const response = await fetch(`http://localhost:8080/api/teachers/quizzes`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          let errorMessage = 'Failed to fetch quizzes';
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in again.');
          } else if (response.status === 403) {
            throw new Error('You do not have permission to view quizzes.');
          }
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('ViewQuizzes - Fetched quizzes:', data);
        setQuizzes(data);
      } catch (err) {
        console.error('ViewQuizzes - Error fetching quizzes:', err);
        setError(err.message || 'Failed to load quizzes');
        toast.error(err.message || 'Failed to load quizzes', {
          className: 'bg-red-100 text-red-800 rounded-xl',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [user, navigate]);

  async function handleToggleActive(quizId) {
    console.log('Toggling active state for quiz ID:', quizId);
    try {
      const headers = authHeader();
      const response = await fetch(`http://localhost:8080/api/teachers/quizzes/${quizId}/activate`, {
        method: 'PUT',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to modify quizzes.');
        }
        throw new Error('Failed to toggle active state');
      }

      setQuizzes(quizzes.map((quiz) => {
        if (quiz.id === quizId) {
          return { ...quiz, isActive: !quiz.isActive };
        }
        return quiz;
      }));
      toast.success(`Quiz ${quizzes.find((q) => q.id === quizId).isActive ? 'deactivated' : 'activated'} successfully!`, {
        className: 'bg-green-100 text-green-800 rounded-xl',
      });
    } catch (error) {
      console.error('Error toggling active state:', error);
      setError('Failed to toggle active state');
      toast.error(error.message || 'Failed to toggle active state', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
    }
  }

  async function handleDeleteQuiz(quizId) {
    console.log('Attempting to delete quiz ID:', quizId);
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      try {
        const headers = authHeader();
        const response = await fetch(`http://localhost:8080/api/teachers/quizzes/${quizId}`, {
          method: 'DELETE',
          headers,
        });

        if (!response.ok) {
          let errorMessage = 'Failed to delete quiz';
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in again.');
          } else if (response.status === 403) {
            throw new Error('You do not have permission to delete this quiz.');
          } else if (response.status === 404) {
            throw new Error('Quiz not found.');
          } else if (response.status === 400) {
            throw new Error('Cannot delete quiz because it has associated questions or submissions.');
          }
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
          }
          throw new Error(errorMessage);
        }

        setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
        toast.success('Quiz deleted successfully!', {
          className: 'bg-green-100 text-green-800 rounded-xl',
        });
      } catch (error) {
        console.error('Error deleting quiz:', error);
        setError(error.message || 'Failed to delete quiz');
        toast.error(error.message || 'Failed to delete quiz', {
          className: 'bg-red-100 text-red-800 rounded-xl',
        });
      }
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans antialiased flex">
      <Sidebar user={user} activeItem="view-quizzes" onLogout={handleLogout} />

      <div className="flex flex-col flex-1 md:pl-80">
        <div className="md:hidden h-16"></div>
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Header Section */}
              <div className="bg-white shadow-xl rounded-2xl mb-8 p-6 flex flex-wrap justify-between items-center">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Quizzes</h1>
                  <p className="text-gray-600 mt-1 text-base font-medium">Manage and create quizzes for your classes</p>
                </div>
                <div className="flex items-center space-x-3 mt-3 sm:mt-0">
                  <button
                    onClick={() => navigate('/teacher/create-quiz')}
                    className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    aria-label="Create a new quiz"
                  >
                    <Plus size={16} className="mr-2" />
                    Create Quiz
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
                  <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-base font-medium text-gray-600">Loading quizzes...</p>
                </div>
              ) : error ? (
                /* Error State */
                <div className="bg-white border border-red-200 rounded-2xl p-6 text-center shadow-xl">
                  <HelpCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                  <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-300"
                    aria-label="Retry loading quizzes"
                  >
                    Retry Connection
                  </button>
                </div>
              ) : quizzes.length === 0 ? (
                /* Empty State */
                <div className="text-center py-16 bg-white rounded-2xl shadow-xl">
                  <HelpCircle size={80} className="text-cyan-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">No Quizzes Found</h2>
                  <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">Create your first quiz to get started.</p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => navigate(-1)}
                      className="px-5 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm"
                      aria-label="Go back"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => navigate('/teacher/create-quiz')}
                      className="inline-flex items-center px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                      aria-label="Create your first quiz"
                    >
                      <Plus size={20} className="mr-2" />
                      Create First Quiz
                    </button>
                  </div>
                </div>
              ) : (
                /* Quiz List */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-900 tracking-tight line-clamp-1">{quiz.title}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              quiz.isActive ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {quiz.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3 leading-relaxed">
                          {quiz.description || 'No description available.'}
                        </p>
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <BookOpen size={16} className="mr-2 text-cyan-600" />
                          <span className="font-medium">
                            {quiz.course ? (
                              <Link
                                to={`/class-details/${quiz.course.id}`}
                                className="text-cyan-600 hover:text-cyan-800 transition-colors"
                                aria-label={`View course ${quiz.course.title}`}
                              >
                                {quiz.course.title} ({quiz.course.code})
                              </Link>
                            ) : (
                              'No course assigned'
                            )}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-6">
                          <Clock size={16} className="mr-2 text-cyan-600" />
                          <span className="font-medium">{quiz.durationMinutes || 0} minutes</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleToggleActive(quiz.id)}
                            className={`flex items-center px-3 py-1 text-xs font-semibold text-white rounded-xl shadow-sm transition-all duration-300 ${
                              quiz.isActive
                                ? 'bg-amber-500 hover:bg-amber-600'
                                : 'bg-teal-500 hover:bg-teal-600'
                            }`}
                            aria-label={quiz.isActive ? 'Deactivate quiz' : 'Activate quiz'}
                          >
                            {quiz.isActive ? (
                              <>
                                <ToggleLeft size={14} className="mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ToggleRight size={14} className="mr-1" />
                                Activate
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => navigate(`/teacher/add-question-to-quiz/${quiz.id}`)}
                            className="flex items-center px-3 py-1 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-sm transition-all duration-300"
                            aria-label="Add questions to quiz"
                          >
                            <Plus size={14} className="mr-1" />
                            Add Questions
                          </button>
                          <button
                            onClick={() => navigate(`/quiz-details/${quiz.id}`)}
                            className="flex items-center px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-sm transition-all duration-300"
                            aria-label="View quiz details"
                          >
                            <Eye size={14} className="mr-1" />
                            View Details
                          </button>
                          <button
                            onClick={() => navigate(`/teacher/edit-quiz/${quiz.id}`)}
                            className="flex items-center px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all duration-300"
                            aria-label="Edit quiz"
                          >
                            <Edit size={14} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="flex items-center px-3 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all duration-300"
                            aria-label="Delete quiz"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

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
        toastClassName="rounded-xl bg-white shadow-md"
      />
    </div>
  );
}

export default ViewQuizzes;