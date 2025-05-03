import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Save, X, AlertCircle, Edit } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authHeader from '../../services/authHeader';
import Sidebar from '../dashboard/Sidebar';

function EditQuiz({ user }) {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    durationMinutes: '',
    startTime: '',
    endTime: '',
  });
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !Array.isArray(user.roles) || !user.roles.includes('ROLE_TEACHER')) {
      console.log('EditQuiz - redirecting to login');
      localStorage.clear();
      navigate('/login', { state: { message: 'Please log in as a teacher to access this page.' } });
      return;
    }

    const fetchQuiz = async () => {
      try {
        const headers = authHeader();
        const response = await fetch(`https://assessmate-j21k.onrender.com/api/teachers/quizzes`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          let errorMessage = 'Failed to fetch quiz';
          if (response.status === 401) throw new Error('Unauthorized: Please log in again.');
          if (response.status === 403) throw new Error('You do not have permission to view this quiz.');
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
          }
          throw new Error(errorMessage);
        }

        const quizzes = await response.json();
        const targetQuiz = quizzes.find((q) => q.id === parseInt(quizId));
        if (!targetQuiz) throw new Error('Quiz not found');

        setQuiz({
          title: targetQuiz.title || '',
          description: targetQuiz.description || '',
          durationMinutes: targetQuiz.durationMinutes || '',
          startTime: targetQuiz.startTime ? new Date(targetQuiz.startTime).toISOString().slice(0, 16) : '',
          endTime: targetQuiz.endTime ? new Date(targetQuiz.endTime).toISOString().slice(0, 16) : '',
        });
        setSelectedCourse(targetQuiz.course ? targetQuiz.course.id : '');
      } catch (err) {
        console.error('EditQuiz - Error fetching quiz:', err);
        setError(err.message || 'Failed to load quiz');
        toast.error(err.message || 'Failed to load quiz', {
          className: 'bg-red-100 text-red-800 rounded-xl',
        });
      }
    };

    const fetchCourses = async () => {
      try {
        const headers = authHeader();
        const response = await fetch(`https://assessmate-j21k.onrender.com/api/teachers/courses`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          let errorMessage = 'Failed to fetch courses';
          if (response.status === 401) throw new Error('Unauthorized: Please log in again.');
          if (response.status === 403) throw new Error('You do not have permission to view courses.');
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('EditQuiz - Error fetching courses:', err);
        setError(err.message || 'Failed to load courses');
        toast.error(err.message || 'Failed to load courses', {
          className: 'bg-red-100 text-red-800 rounded-xl',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
    fetchCourses();
  }, [user, navigate, quizId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!quiz.title.trim()) {
      setError('Quiz title is required');
      toast.error('Quiz title is required', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
      return;
    }

    if (quiz.durationMinutes && isNaN(parseInt(quiz.durationMinutes))) {
      setError('Duration must be a valid number');
      toast.error('Duration must be a valid number', {
        className: 'bg-red-100 text-red-800 rounded-xl',
      });
      return;
    }

    try {
      const headers = authHeader();
      const payload = {
        title: quiz.title,
        description: quiz.description,
        durationMinutes: parseInt(quiz.durationMinutes) || 0,
        startTime: quiz.startTime ? new Date(quiz.startTime).toISOString() : null,
        endTime: quiz.endTime ? new Date(quiz.endTime).toISOString() : null,
      };

      const response = await fetch(`https://assessmate-j21k.onrender.com/api/teachers/quizzes/${quizId}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to update quiz';
        if (response.status === 401) throw new Error('Unauthorized: Please log in again.');
        if (response.status === 403) throw new Error('You do not have permission to update this quiz.');
        if (response.status === 404) throw new Error('Quiz not found.');
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      toast.success('Quiz updated successfully!', {
        className: 'bg-green-100 text-green-800 rounded-xl',
      });
      navigate('/teacher/view-quizzes');
    } catch (err) {
      console.error('EditQuiz - Error updating quiz:', err);
      setError(err.message || 'Failed to update quiz');
      toast.error(err.message || 'Failed to update quiz', {
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
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-white shadow-2xl rounded-3xl p-8 mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
                  Edit Quiz
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                  Update the details for your quiz below.
                </p>

                {loading ? (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-600">Loading quiz details...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-100 border border-red-200 rounded-xl p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <p className="text-red-600 text-lg font-medium">{error}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Quiz Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={quiz.title}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                        placeholder="Enter quiz title"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={quiz.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                        placeholder="Enter quiz description"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        name="durationMinutes"
                        id="durationMinutes"
                        value={quiz.durationMinutes}
                        onChange={handleInputChange}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                        placeholder="Enter duration in minutes"
                      />
                    </div>

                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        id="startTime"
                        value={quiz.startTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        id="endTime"
                        value={quiz.endTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                        Course
                      </label>
                      <select
                        id="course"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 bg-gray-100 text-gray-500 sm:text-sm"
                      >
                        <option value="">Course cannot be changed</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title} ({course.code})
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-sm text-gray-500">
                        Note: The course cannot be changed after quiz creation. Create a new quiz to assign it to a different course.
                      </p>
                    </div>

                    <div className="flex justify-between space-x-4">
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() => navigate('/teacher/view-quizzes')}
                          className="inline-flex items-center px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          aria-label="Cancel editing"
                        >
                          <X size={20} className="mr-2" />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-2xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                          aria-label="Save quiz changes"
                        >
                          <Save size={20} className="mr-2" />
                          Save Changes
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/teacher/edit-quiz/${quizId}/questions`)}
                        className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        aria-label="Edit quiz questions"
                      >
                        <Edit size={20} className="mr-2" />
                        Edit Questions
                      </button>
                    </div>
                  </form>
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

export default EditQuiz;