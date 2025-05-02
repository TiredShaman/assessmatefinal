import React, { useState } from 'react';
import authHeader from '../../services/authHeader';
import { useParams } from 'react-router-dom'; // To get courseId from URL

function AddStudentToCourse() {
  const { courseId } = useParams(); // Get courseId from the route parameters
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const requestData = { username: username.trim() };

    try {
      const response = await fetch(`http://localhost:8080/api/teachers/courses/${courseId}/students`, {
        method: 'POST',
        headers: authHeader(), // Include the Authorization header and Content-Type
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
         if (response.status === 403) {
            setError("You do not have permission to add students to this course.");
         } else {
            throw new Error(data.message || `Failed to add student with status ${response.status}`);
         }
      } else {
        setMessage(data.message || 'Student added successfully!');
        setUsername(''); // Clear username field on success
      }

    } catch (err) {
      console.error('Error adding student:', err);
      setError(err.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Student to Course {courseId}</h1>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Student Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudentToCourse;
