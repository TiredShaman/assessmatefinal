import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AlertCircle, CheckCircle, Send, Loader } from 'lucide-react';
import authHeader from '../../services/authHeader';
import config from '../../config/config.js';

function TakeQuiz({ user }) {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizDetails, setQuizDetails] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    if (!user || !user.roles || !user.roles.includes('ROLE_STUDENT')) {
      navigate('/login', { state: { message: 'Please log in as a student.' } });
      return;
    }

    const fetchQuizDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = authHeader();
        if (!headers.Authorization) {
          throw new Error('No authentication token found. Please login again.');
        }

        const response = await fetch(`${config.API_URL}/api/students/quizzes/${quizId}`, {
          method: 'GET',
          headers,
        });

        console.log('Fetch Quiz Response Status:', response.status);
        const data = await response.json();
        console.log('Fetched Quiz Details:', data);

        if (response.status === 401 || response.status === 403) {
          localStorage.clear();
          navigate('/login', { state: { message: 'Session expired or unauthorized. Please log in again.' } });
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || `Failed to fetch quiz details (Status: ${response.status})`);
        }

        setQuizDetails(data);
        // Initialize answers state
        const initialAnswers = {};
        if (data.questions) {
          data.questions.forEach(q => {
            initialAnswers[q.id] = { selectedOptionIds: [], textAnswer: '' };
          });
        }
        setAnswers(initialAnswers);
      } catch (err) {
        console.error('Error fetching quiz details:', err);
        setError(err.message);
        toast.error(err.message, { theme: 'colored' });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId, navigate, user]);

  const handleOptionChange = (questionId, optionId, isMultipleChoice) => {
    setAnswers(prev => {
      const currentSelection = prev[questionId]?.selectedOptionIds || [];
      let newSelection;
      if (isMultipleChoice) {
        newSelection = currentSelection.includes(optionId)
          ? currentSelection.filter(id => id !== optionId)
          : [...currentSelection, optionId];
      } else {
        newSelection = [optionId];
      }
      return {
        ...prev,
        [questionId]: { ...prev[questionId], selectedOptionIds: newSelection },
      };
    });
  };

  const handleTextChange = (questionId, text) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], textAnswer: text },
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    let allAnswered = true;
    if (quizDetails && quizDetails.questions) {
      for (const question of quizDetails.questions) {
        const answer = answers[question.id];
        const hasSelectedOption = answer?.selectedOptionIds && answer.selectedOptionIds.length > 0;
        const hasTextAnswer = answer?.textAnswer && answer.textAnswer.trim() !== '';
        if (!hasSelectedOption && !hasTextAnswer) {
          allAnswered = false;
          break;
        }
      }
    }

    if (!allAnswered) {
      toast.warn('Please answer all questions before submitting.', { theme: 'colored' });
      setSubmitting(false);
      return;
    }

    const submissionData = { answers: {} };
    Object.keys(answers).forEach(questionId => {
      submissionData.answers[questionId] = {
        selectedOptionIds: answers[questionId].selectedOptionIds || [],
        textAnswer: answers[questionId].textAnswer || '',
      };
    });

    console.log('Submitting Quiz Data:', JSON.stringify(submissionData));

    try {
      const headers = authHeader();
      if (!headers.Authorization) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${config.API_URL}/api/students/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to submit quiz (Status: ${response.status})`);
      }

      console.log('Submission Result:', result);
      toast.success(result.message || 'Quiz submitted successfully!', { theme: 'colored' });
      setSubmissionSuccess(true);
      setTimeout(() => navigate('/student/view-courses'), 3000);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(err.message);
      toast.error(err.message, { theme: 'colored' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-10 w-10 animate-spin text-cyan-600" />
        <p className="ml-3 text-gray-600">Loading Quiz...</p>
      </div>
    );
  }

  if (error && !submissionSuccess) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 text-center mb-4">{error}</p>
        <button
          onClick={() => navigate('/student/view-courses')}
          className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  if (submissionSuccess) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Quiz Submitted Successfully!</h2>
        <p className="text-gray-600">Your answers have been recorded.</p>
        <p className="text-gray-500 mt-4">Redirecting back to courses shortly...</p>
      </div>
    );
  }

  if (!quizDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Quiz data not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-6">
          <h1 className="text-3xl font-bold text-white">{quizDetails.title || 'Quiz'}</h1>
          {quizDetails.description && <p className="text-cyan-100 mt-1">{quizDetails.description}</p>}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {quizDetails.questions && quizDetails.questions.length > 0 ? (
            quizDetails.questions.map((question, index) => (
              <div key={question.id} className="mb-8 pb-6 border-b border-gray-200 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Question {index + 1}: {question.questionText}
                </h3>
                {question.options && question.options.length > 0 ? (
                  <div className="space-y-3">
                    {question.options.map(option => (
                      <label
                        key={option.id}
                        className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <input
                          type={question.type === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
                          name={`question_${question.id}`}
                          value={option.id}
                          checked={answers[question.id]?.selectedOptionIds?.includes(option.id) || false}
                          onChange={() => handleOptionChange(question.id, option.id, question.type === 'MULTIPLE_CHOICE')}
                          className={`mr-3 h-5 w-5 text-cyan-600 border-gray-300 focus:ring-cyan-500 ${
                            question.type === 'MULTIPLE_CHOICE' ? 'form-checkbox' : 'form-radio'
                          }`}
                        />
                        <span className="text-gray-700">{option.optionText}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div>
                    <textarea
                      name={`question_${question.id}_text`}
                      rows="4"
                      value={answers[question.id]?.textAnswer || ''}
                      onChange={e => handleTextChange(question.id, e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                      placeholder="Type your answer here..."
                    ></textarea>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">This quiz currently has no questions.</p>
          )}

          {quizDetails.questions && quizDetails.questions.length > 0 && (
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
                } transition-all duration-200`}
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="-ml-1 mr-2 h-5 w-5" />
                    Submit Quiz
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default TakeQuiz;