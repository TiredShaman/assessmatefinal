import React, { useState, useEffect } from 'react';
import authHeader from '../../services/authHeader';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import Sidebar from '../dashboard/Sidebar'; // Importing Sidebar from ViewCourses

function CreateQuiz({ user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CreateQuiz - useEffect - user:', user);
    if (!user || !Array.isArray(user.roles) || !user.roles.includes('ROLE_TEACHER')) {
      console.log('CreateQuiz - redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    const fetchCourses = async () => {
      try {
        const headers = authHeader();
        console.log('CreateQuiz - Fetching courses with headers:', headers);
        const response = await fetch('https://assessmate-j21k.onrender.com/api/teachers/courses', {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in again.');
          } else if (response.status === 403) {
            throw new Error('You do not have permission to view courses.');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to fetch courses with status ${response.status}`);
          }
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('CreateQuiz - Error fetching courses:', err);
        setError(err.message || 'Failed to load courses');
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!selectedCourseId) {
      setError('Please select a course for the quiz.');
      setLoading(false);
      return;
    }

    const quizData = {
      title,
      description,
      startTime: startTime ? `${startTime}:00` : '',
      endTime: endTime ? `${endTime}:00` : '',
      durationMinutes: parseInt(durationMinutes, 10),
    };

    try {
      const headers = authHeader();
      console.log('CreateQuiz - Sending POST with headers:', headers);
      console.log('CreateQuiz - Sending POST with body:', quizData);
      const response = await fetch(`https://assessmate-j21k.onrender.com/api/teachers/courses/${selectedCourseId}/quizzes`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized: Please log in again.');
          navigate('/login', { replace: true });
        } else if (response.status === 403) {
          setError('You do not have permission to create quizzes for this course.');
        } else {
          throw new Error(data.message || `Failed to create quiz with status ${response.status}`);
        }
      } else {
        setMessage(data.message || 'Quiz created successfully!');
        setTitle('');
        setDescription('');
        setStartTime('');
        setEndTime('');
        setDurationMinutes('');
        setSelectedCourseId('');

        if (data && data.quizId !== null && data.quizId !== undefined) {
          navigate(`/teacher/add-question-to-quiz/${data.quizId}`);
        } else {
          setMessage('Quiz created, but no quiz ID returned. Please add questions manually.');
        }
      }
    } catch (err) {
      console.error('CreateQuiz - Error creating quiz:', err);
      let errorMessage = 'Failed to create quiz';
      if (err && err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans antialiased flex">
      <Sidebar user={user} activeItem="create-quiz" onLogout={handleLogout} />

      <div className="flex flex-col flex-1 md:pl-80">
        <div className="md:hidden h-16"></div>
        <main className="flex-1">
          <div className="py-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 transform transition-all duration-500 animate-fade-in">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-6 text-center">
                  Create a New Quiz
                </h1>
                <p className="text-gray-600 text-lg font-medium text-center mb-8">
                  Design a quiz for your students with customized settings
                </p>

                {message && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 mb-6 rounded-2xl flex items-center animate-pulse">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                    <p className="font-medium">{message}</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-2xl flex items-center animate-pulse">
                    <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                {coursesLoading && (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-600">Loading courses...</p>
                  </div>
                )}

                {!coursesLoading && (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                      <label
                        htmlFor="courseSelect"
                        className="block text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                      >
                        <div className="flex items-center">
                          <BookOpen size={20} className="mr-2 text-cyan-600" />
                          Select Course
                        </div>
                      </label>
                      <select
                        id="courseSelect"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={coursesLoading || courses.length === 0}
                        required
                      >
                        <option value="">-- Select a Course --</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title} ({course.code})
                          </option>
                        ))}
                      </select>
                      {!coursesLoading && courses.length === 0 && (
                        <p className="mt-3 text-sm text-red-600">
                          No courses available. Please create a course first.
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="quizTitle"
                        className="block text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                      >
                        Quiz Title
                      </label>
                      <input
                        type="text"
                        id="quizTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 transition-all duration-300 hover:shadow-md"
                        placeholder="e.g., Midterm Exam"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="quizDescription"
                        className="block text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                      >
                        Description
                      </label>
                      <textarea
                        id="quizDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 transition-all duration-300 hover:shadow-md"
                        placeholder="Brief quiz description..."
                        rows="4"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="startTime"
                          className="block text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                        >
                          <div className="flex items-center">
                            <Calendar size={20} className="mr-2 text-cyan-600" />
                            Start Time
                          </div>
                        </label>
                        <input
                          type="datetime-local"
                          id="startTime"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 transition-all duration-300 hover:shadow-md"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="endTime"
                          className="block text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                        >
                          <div className="flex items-center">
                            <Calendar size={20} className="mr-2 text-cyan-600" />
                            End Time
                          </div>
                        </label>
                        <input
                          type="datetime-local"
                          id="endTime"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 transition-all duration-300 hover:shadow-md"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="durationMinutes"
                        className="block text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                      >
                        <div className="flex items-center">
                          <Clock size={20} className="mr-2 text-cyan-600" />
                          Duration (Minutes)
                        </div>
                      </label>
                      <input
                        type="number"
                        id="durationMinutes"
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(e.target.value)}
                        className="w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm bg-gray-50 focus:ring-cyan-500 focus:border-cyan-500 text-gray-700 transition-all duration-300 hover:shadow-md"
                        placeholder="e.g., 60"
                        required
                        min="1"
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || coursesLoading || courses.length === 0}
                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-2xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Creating Quiz...' : 'Create Quiz'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateQuiz;
