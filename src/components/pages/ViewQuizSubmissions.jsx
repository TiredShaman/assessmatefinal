import React, { useEffect, useState } from 'react';
import authHeader from '../../services/authHeader';
import { useParams } from 'react-router-dom'; // To get quizId from URL

function ViewQuizSubmissions() {
  const { quizId } = useParams(); // Get quizId from the route parameters
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch submissions for a specific quiz
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`https://assessmate-j21k.onrender.com/api/teachers/quizzes/${quizId}/submissions`, {
          method: 'GET',
          headers: authHeader(), // Include the Authorization header
        });

        if (!response.ok) {
           if (response.status === 403) {
              setError("You do not have permission to view submissions for this quiz.");
           } else {
              const errorData = await response.json();
              throw new Error(errorData.message || `Failed to fetch submissions with status ${response.status}`);
           }
        } else {
           const data = await response.json();
           setSubmissions(data);
        }

      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError(err.message || 'Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [quizId]); // Re-run effect if quizId changes

  if (loading) {
    return <div className="text-center mt-8">Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Submissions for Quiz {quizId}</h1>
      {submissions.length === 0 ? (
        <p className="text-center text-gray-600">No submissions found yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Student Submissions</h2>
          <ul>
            {submissions.map(submission => (
              <li key={submission.id} className="border-b last:border-b-0 py-4">
                <p className="font-semibold">Student: {submission.student ? submission.student.username : 'N/A'}</p>
                <p>Submitted At: {new Date(submission.submissionTime).toLocaleString()}</p>
                <p>Score: {submission.score !== null ? submission.score : 'Not Graded Yet'}</p>
                {/* Example button to view/grade a specific submission */}
                 {/* You would need a route like /grade-submission/:submissionId */}
                <button
                   onClick={() => alert(`Navigate to grade submission ${submission.id}`)} // Replace with actual navigation
                   className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition mt-2"
                >
                   {submission.isGraded ? 'View Grade' : 'Grade Submission'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ViewQuizSubmissions;
