import React, { useState } from 'react';
import authHeader from '../../services/authHeader'; // Assuming this service exists
import { useParams, useNavigate } from 'react-router-dom'; // To get quizId from URL
import { PlusCircle, MinusCircle, CheckCircle, AlertCircle, Edit3, Layers, DollarSign } from 'lucide-react'; // Added icons

// This component allows teachers to add questions to a specific quiz.
// It handles different question types, including options for Multiple Choice.
function AddQuestionToQuiz() {
  const { quizId } = useParams(); // Get quizId from the route parameters
  const [questionText, setQuestionText] = useState(''); // State for the question text
  const [type, setType] = useState('MULTIPLE_CHOICE'); // State for the question type, default is Multiple Choice
  const [points, setPoints] = useState(''); // State for the points the question is worth
  // State for options, initialized with one empty option for Multiple Choice
  const [options, setOptions] = useState([{ optionText: '', isCorrect: false }]);
  const [loading, setLoading] = useState(false); // State for the loading status during submission
  const [message, setMessage] = useState(null); // State for success messages
  const [error, setError] = useState(null); // State for error messages
  const navigate = useNavigate(); // Hook for navigation

  // Function to add a new option field for Multiple Choice questions
  const handleAddOption = () => {
    setOptions([...options, { optionText: '', isCorrect: false }]);
  };

  // Function to update an option's text or correctness based on index and field
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  // Function to remove an option field based on index
  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Handler for form submission to add the question
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true
    setMessage(null); // Clear previous messages
    setError(null); // Clear previous errors

    // Prepare question data based on the selected type
    const questionData = {
      questionText,
      type,
      points: parseInt(points, 10), // Convert points to a number
      // Only include options if the type is MULTIPLE_CHOICE
      options: type === 'MULTIPLE_CHOICE' ? options : [],
    };

    try {
      // Get authentication headers, assuming authHeader includes 'Content-Type': 'application/json'
      const headers = authHeader();

      // Make POST request to add the question to the specific quiz
      const response = await fetch(`http://localhost:8080/api/teachers/quizzes/${quizId}/questions`, {
        method: 'POST',
        headers: {
             ...headers, // Include auth headers
            'Content-Type': 'application/json', // Ensure content type is set
        },
        body: JSON.stringify(questionData), // Send question data as JSON string
      });

      const data = await response.json(); // Parse the JSON response

      // Handle non-OK responses
      if (!response.ok) {
         if (response.status === 401) {
            // Handle Unauthorized error
            setError('Unauthorized: Please log in again.');
            navigate('/login', { replace: true }); // Redirect to login
         } else if (response.status === 403) {
            // Handle Forbidden error
            setError("You do not have permission to add questions to this quiz.");
         } else {
            // Handle other HTTP errors
            throw new Error(data.message || `Failed to add question with status ${response.status}`);
         }
      } else {
        // Handle successful question addition
        setMessage(data.message || 'Question added successfully!'); // Set success message
        // Clear form fields on success to prepare for the next question
        setQuestionText('');
        setPoints('');
        // Reset options based on the current type (empty for non-MC, one empty for MC)
        setType('MULTIPLE_CHOICE'); // Reset type to default
        setOptions([{ optionText: '', isCorrect: false }]); // Reset options for MC
      }

    } catch (err) {
      // Catch any errors during the POST request
      console.error('Error adding question:', err);
      setError(err.message || 'Failed to add question'); // Set error state
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // Render the component UI
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-8 text-center text-cyan-800">Add Question to Quiz {quizId}</h1>

        {/* Form Container Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Success Message */}
          {message && (
            <div className="bg-teal-50 border-l-4 border-teal-500 text-teal-800 p-4 mb-6 mx-6 mt-6 rounded-md" role="alert">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-teal-600 mr-3" />
                <p className="font-medium">{message}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 mb-6 mx-6 mt-6 rounded-md" role="alert">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Question Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Question Text Input */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="questionText">
                    <div className="flex items-center">
                       <Edit3 size={18} className="mr-2 text-cyan-600" />
                       Question Text
                    </div>
                  </label>
                  <textarea
                    id="questionText"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 border-gray-300 text-gray-700"
                    placeholder="Enter the question text"
                    rows="3"
                    required
                  ></textarea>
                </div>

                {/* Question Type Select */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="questionType">
                    <div className="flex items-center">
                       <Layers size={18} className="mr-2 text-cyan-600" />
                       Question Type
                    </div>
                  </label>
                  <select
                    id="questionType"
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        // Reset options when type changes
                        if (e.target.value === 'MULTIPLE_CHOICE') {
                            setOptions([{ optionText: '', isCorrect: false }]);
                        } else {
                            setOptions([]); // Clear options for non-MC types
                        }
                    }}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 border-gray-300 text-gray-700"
                    required
                  >
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="TRUE_FALSE">True/False</option>
                    <option value="SHORT_ANSWER">Short Answer</option>
                    {/* Add other types as needed */}
                  </select>
                </div>

                {/* Points Input */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="points">
                    <div className="flex items-center">
                       <DollarSign size={18} className="mr-2 text-cyan-600" />
                       Points
                    </div>
                  </label>
                  <input
                    type="number"
                    id="points"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 border-gray-300 text-gray-700"
                    placeholder="Enter points for this question"
                    required
                    min="0" // Points should be non-negative
                  />
                </div>

                {/* Options section for Multiple Choice */}
                {type === 'MULTIPLE_CHOICE' && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Options</h3>
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center mb-3 space-x-2">
                        {/* Option Text Input */}
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          value={option.optionText}
                          onChange={(e) => handleOptionChange(index, 'optionText', e.target.value)}
                          className="flex-grow px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 border-gray-300 text-gray-700"
                          required
                        />
                        {/* Correct Answer Checkbox */}
                        <label className="flex items-center text-gray-700">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                            className="mr-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                          />
                          Correct
                        </label>
                        {/* Remove Option Button (show if more than one option) */}
                        {options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Remove Option"
                          >
                            <MinusCircle size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    {/* Add Option Button */}
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                       <PlusCircle size={18} className="mr-2" />
                       Add Option
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-lg shadow-md transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none font-medium"
                  >
                    {loading ? 'Adding Question...' : 'Add Question'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddQuestionToQuiz;
