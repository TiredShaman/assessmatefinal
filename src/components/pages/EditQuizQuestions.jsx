import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, AlertCircle, Trash2, Edit } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authHeader from '../../services/authHeader';
import Sidebar from '../dashboard/Sidebar';

function EditQuizQuestions({ user }) {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !Array.isArray(user.roles) || !user.roles.includes('ROLE_TEACHER')) {
      console.log('EditQuizQuestions - redirecting to login');
      localStorage.clear();
      navigate('/login', { state: { message: 'Please log in as a teacher to access this page.' } });
      return;
    }

    const fetchQuestions = async () => {
      try {
        const headers = authHeader();
        const response = await fetch(`http://localhost:8080/api/teachers/quizzes/${quizId}/questions`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          let errorMessage = 'Failed to fetch questions';
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in again.');
          } else if (response.status === 403) {
            throw new Error('You do not have permission to view these questions.');
          } else if (response.status === 404) {
            throw new Error('Quiz not found.');
          } else if (response.status === 500) {
            errorMessage = 'Server error: Unable to fetch questions due to a backend issue.';
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
        console.log('EditQuizQuestions - Fetched questions:', data);
        setQuestions(data.map(q => ({
          id: q.id,
          text: q.text || '',
          options: q.options ? [...q.options] : ['', '', '', ''],
          correctAnswer: q.correctAnswer || '',
          points: q.points || 1,
          isEditing: false,
        })));
      } catch (err) {
        console.error('EditQuizQuestions - Error fetching questions:', err);
        setError(err.message || 'Failed to load questions');
        toast.error(err.message || 'Failed to load questions', {
          className: 'bg-red-100 text-red-800 rounded-xl',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [user, navigate, quizId]);

  const handleEditToggle = (questionId) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, isEditing: !q.isEditing } : { ...q, isEditing: false }
    ));
  };

  const handleQuestionChange = (questionId, field, value, optionIndex = null) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        if (field === 'options' && optionIndex !== null) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const handleSaveQuestion = async (question) => {
    setError(null);
    // Validation
    if (!question.text.trim()) {
      setError('Question text is required');
      toast.error('Question text is required', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
      return;
    }
    if (question.options.some(opt => !opt.trim())) {
      setError('All options must be filled');
      toast.error('All options must be filled', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
      return;
    }
    if (!question.correctAnswer.trim() || !question.options.includes(question.correctAnswer)) {
      setError('Correct answer must be one of the options');
      toast.error('Correct answer must be one of the options', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
      return;
    }
    if (isNaN(parseInt(question.points)) || parseInt(question.points) < 1) {
      setError('Points must be a positive number');
      toast.error('Points must be a positive number', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
      return;
    }

    try {
      const headers = authHeader();
      const payload = {
        text: question.text,
        options: question.options,
        correctAnswer: question.correctAnswer,
        points: parseInt(question.points),
      };

      const response = await fetch(`http://localhost:8080/api/teachers/quizzes/${quizId}/questions/${question.id}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to update question';
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to update this question.');
        } else if (response.status === 404) {
          throw new Error('Question or quiz not found.');
        } else if (response.status === 500) {
          errorMessage = 'Server error: Unable to update question due to a backend issue.';
        }
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      setQuestions(questions.map(q => 
        q.id === question.id ? { ...q, isEditing: false } : q
      ));
      toast.success('Question updated successfully!', {
        className: 'bg-green-100 text-green-800 rounded-xl',
      });
    } catch (err) {
      console.error('EditQuizQuestions - Error updating question:', err);
      setError(err.message || 'Failed to update question');
      toast.error(err.message || 'Failed to update question', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
    }
  };

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
          <div className="py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-white shadow-2xl rounded-3xl p-8 mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
                  Edit Quiz Questions
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                  Modify the questions for your quiz below.
                </p>

                {loading ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-600">Loading questions...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-100 border border-red-200 rounded-xl p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <p className="text-red-600 text-lg font-medium">{error}</p>
                  </div>
                ) : questions.length === 0 ? (
                  <div className="text-center py-10">
                    <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">No questions found for this quiz.</p>
                    <button
                      onClick={() => navigate(`/teacher/add-question-to-quiz/${quizId}`)}
                      className="mt-4 inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-2xl shadow-md transition-all duration-300"
                      aria-label="Add a new question"
                    >
                      Add Question
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {questions.map((question) => (
                      <div key={question.id} className="border border-gray-200 rounded-xl p-6">
                        {question.isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <label htmlFor={`text-${question.id}`} className="block text-sm font-medium text-gray-700">
                                Question Text
                              </label>
                              <textarea
                                id={`text-${question.id}`}
                                value={question.text}
                                onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                                rows="3"
                                className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                placeholder="Enter question text"
                              />
                            </div>
                            {question.options.map((option, index) => (
                              <div key={index}>
                                <label htmlFor={`option-${question.id}-${index}`} className="block text-sm font-medium text-gray-700">
                                  Option {index + 1}
                                </label>
                                <input
                                  type="text"
                                  id={`option-${question.id}-${index}`}
                                  value={option}
                                  onChange={(e) => handleQuestionChange(question.id, 'options', e.target.value, index)}
                                  className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                  placeholder={`Enter option ${index + 1}`}
                                />
                              </div>
                            ))}
                            <div>
                              <label htmlFor={`correctAnswer-${question.id}`} className="block text-sm font-medium text-gray-700">
                                Correct Answer
                              </label>
                              <select
                                id={`correctAnswer-${question.id}`}
                                value={question.correctAnswer}
                                onChange={(e) => handleQuestionChange(question.id, 'correctAnswer', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                              >
                                <option value="">Select correct answer</option>
                                {question.options.map((option, index) => (
                                  <option key={index} value={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label htmlFor={`points-${question.id}`} className="block text-sm font-medium text-gray-700">
                                Points
                              </label>
                              <input
                                type="number"
                                id={`points-${question.id}`}
                                value={question.points}
                                onChange={(e) => handleQuestionChange(question.id, 'points', e.target.value)}
                                min="1"
                                className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                                placeholder="Enter points"
                              />
                            </div>
                            <div className="flex justify-end space-x-4">
                              <button
                                type="button"
                                onClick={() => handleEditToggle(question.id)}
                                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl shadow-sm transition-all duration-300"
                                aria-label="Cancel editing question"
                              >
                                <X size={20} className="mr-2" />
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveQuestion(question)}
                                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-2xl shadow-md transition-all duration-300"
                                aria-label="Save question changes"
                              >
                                <Save size={20} className="mr-2" />
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{question.text}</h3>
                            <ul className="mt-2 list-disc pl-5 text-gray-600">
                              {question.options.map((option, index) => (
                                <li key={index}>{option} {option === question.correctAnswer ? '(Correct)' : ''}</li>
                              ))}
                            </ul>
                            <p className="mt-2 text-sm text-gray-600">Points: {question.points}</p>
                            <div className="mt-4 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleEditToggle(question.id)}
                                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-sm transition-all duration-300"
                                aria-label="Edit question"
                              >
                                <Edit size={18} className="mr-2" />
                                Edit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => navigate(`/teacher/edit-quiz/${quizId}`)}
                        className="inline-flex items-center px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl shadow-sm transition-all duration-300"
                        aria-label="Back to quiz details"
                      >
                        <X size={20} className="mr-2" />
                        Back to Quiz
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/teacher/add-question-to-quiz/${quizId}`)}
                        className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-2xl shadow-md transition-all duration-300"
                        aria-label="Add a new question"
                      >
                        Add Question
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
        toastClassName="rounded-xl"
      />
    </div>
  );
}

export default EditQuizQuestions;