import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authHeader from '../../services/authHeader';

function GradeSubmission() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const headers = authHeader();
        console.log('Fetching submission with headers:', headers);
        const response = await fetch(`http://localhost:8080/api/teachers/submissions/${submissionId}`, {
          method: 'GET',
          headers,
        });
        console.log('Fetch submission response status:', response.status);
        const data = await response.json();
        console.log('Submission data:', data);

        if (!response.ok) {
          throw new Error(data.message || `Failed to fetch submission (Status: ${response.status})`);
        }

        setSubmission(data);
        const initialFeedback = {};
        data.answers.forEach(answer => {
          initialFeedback[answer.id] = { 
            points: answer.points || 0, 
            feedback: answer.teacherFeedback || '',
            maxPoints: answer.question.points || 10 // Default to 10 if points missing
          };
        });
        setAnswerFeedback(initialFeedback);
      } catch (err) {
        console.error('Error fetching submission:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const handleAnswerPointsChange = (answerId, points) => {
    const maxPoints = answerFeedback[answerId].maxPoints;
    const parsedPoints = parseFloat(points) || 0;
    if (parsedPoints > maxPoints) {
      alert(`Points cannot exceed ${maxPoints} for this question.`);
      return;
    }
    setAnswerFeedback(prev => ({
      ...prev,
      [answerId]: { ...prev[answerId], points: parsedPoints },
    }));
  };

  const handleAnswerFeedbackChange = (answerId, feedback) => {
    setAnswerFeedback(prev => ({
      ...prev,
      [answerId]: { ...prev[answerId], feedback },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const totalScore = Object.values(answerFeedback).reduce((sum, fb) => sum + (fb.points || 0), 0);
    const gradeData = {
      score: totalScore,
      answerFeedback: Object.keys(answerFeedback).reduce((acc, answerId) => {
        acc[answerId] = {
          points: answerFeedback[answerId].points,
          feedback: answerFeedback[answerId].feedback,
        };
        return acc;
      }, {}),
    };

    try {
      const headers = authHeader();
      console.log('Submitting grade with data:', gradeData);
      const response = await fetch(`http://localhost:8080/api/teachers/submissions/${submissionId}/grade`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradeData),
      });

      const data = await response.json();
      console.log('Grade submission response:', data);

      if (!response.ok) {
        if (response.status === 403) {
          setError('You do not have permission to grade this submission.');
        } else {
          throw new Error(data.message || `Failed to grade submission (Status: ${response.status})`);
        }
      } else {
        setMessage(data.message || 'Submission graded successfully!');
        setTimeout(() => navigate('/teacher/view-submissions'), 2000);
      }
    } catch (err) {
      console.error('Error grading submission:', err);
      setError(err.message || 'Failed to grade submission');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading submission...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => navigate('/teacher/view-submissions')}
          className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
        >
          Back to Submissions
        </button>
      </div>
    );
  }

  if (!submission) {
    return <div className="text-center p-6">Submission not found.</div>;
  }

  const totalPossiblePoints = submission.answers.reduce((sum, answer) => sum + (answer.question.points || 10), 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Grade Submission {submissionId}</h1>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">Quiz: {submission.quiz?.title}</h2>
          <h3 className="text-lg font-medium mb-4">Student: {submission.student?.username}</h3>
          {submission.answers.map(answer => (
            <div key={answer.id} className="mb-6 p-4 border rounded-lg">
              <p className="font-medium">Question: {answer.question?.questionText}</p>
              <p className="text-gray-600">Type: {answer.question?.type}</p>
              <p className="text-gray-600">Max Points: {answer.question?.points || 10}</p>
              {answer.selectedOptions?.length > 0 ? (
                <p className="text-gray-600">Selected: {answer.selectedOptions.map(opt => opt.optionText).join(', ')}</p>
              ) : (
                <p className="text-gray-600">Answer: {answer.textAnswer || 'No answer'}</p>
              )}
              <div className="mt-2">
                <label className="block text-gray-700">Points (Max {answer.question?.points || 10})</label>
                <input
                  type="number"
                  value={answerFeedback[answer.id]?.points || ''}
                  onChange={e => handleAnswerPointsChange(answer.id, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                  min="0"
                  max={answer.question?.points || 10}
                />
              </div>
              <div className="mt-2">
                <label className="block text-gray-700">Feedback</label>
                <textarea
                  value={answerFeedback[answer.id]?.feedback || ''}
                  onChange={e => handleAnswerFeedbackChange(answer.id, e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Provide feedback..."
                />
              </div>
            </div>
          ))}
          <div className="mt-4">
            <p className="font-medium">
              Total Score: {Object.values(answerFeedback).reduce((sum, fb) => sum + (fb.points || 0), 0)} / {totalPossiblePoints}
            </p>
            <p className="font-medium">
              Percentage: {((Object.values(answerFeedback).reduce((sum, fb) => sum + (fb.points || 0), 0) / totalPossiblePoints) * 100).toFixed(2)}%
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition"
          >
            {submitting ? 'Grading...' : 'Submit Grade'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default GradeSubmission;
