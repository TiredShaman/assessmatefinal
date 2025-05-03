import React, { useState } from 'react';
import authHeader from '../../authHeader'; // Assuming authHeader utility is in this path
import { useParams } from 'react-router-dom'; // To get quizId from URL

function ActivateQuizButton() {
  const { quizId } = useParams(); // Get quizId from the route parameters
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isActivated, setIsActivated] = useState(false); // State to track activation status

  // You might want to fetch the initial activation status on mount
  // For simplicity, this example assumes it starts as not activated

  const handleActivate = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`https://assessmate-j21k.onrender.com/api/teachers/quizzes/${quizId}/activate`, {
        method: 'PUT',
        headers: authHeader(), // Include the Authorization header and Content-Type
      });

      const data = await response.json();

      if (!response.ok) {
         if (response.status === 403) {
            setError("You do not have permission to activate this quiz.");
         } else {
            throw new Error(data.message || `Failed to activate quiz with status ${response.status}`);
         }
      } else {
        setMessage(data.message || 'Quiz activated successfully!');
        setIsActivated(true); // Update state on success
      }

    } catch (err) {
      console.error('Error activating quiz:', err);
      setError(err.message || 'Failed to activate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {message && <p className="text-green-500 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {isActivated ? (
        <p className="text-green-600 font-semibold">Quiz is Active!</p>
      ) : (
        <button
          onClick={handleActivate}
          disabled={loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 disabled:bg-yellow-300 transition"
        >
          {loading ? 'Activating...' : 'Activate Quiz'}
        </button>
      )}
    </div>
  );
}

export default ActivateQuizButton;
