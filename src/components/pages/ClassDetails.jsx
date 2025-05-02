// src/pages/ClassDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authHeader from "../../services/authHeader";
import EnrollStudent from "./EnrollStudent";

function ClassDetails() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const headers = authHeader();
        const response = await fetch(`http://localhost:8080/api/teachers/courses/${classId}`, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          navigate("/view-classes");
          return;
        }

        const data = await response.json();
        setClassDetails(data);
      } catch (error) {
        console.error("Error fetching class details:", error);
        navigate("/view-classes");
      }
    };

    const fetchEnrolledStudents = async () => {
      try {
        const headers = authHeader();
        const response = await fetch(`http://localhost:8080/api/teachers/courses/${classId}/students`, {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          console.error("Error fetching enrolled students:", response.status);
          return;
        }

        const data = await response.json();
        setEnrolledStudents(data);
      } catch (error) {
        console.error("Error fetching enrolled students:", error);
      }
    };

    fetchClassDetails();
    fetchEnrolledStudents();
  }, [classId, navigate, enrolled]);

  const handleEnroll = () => {
    setEnrolled(!enrolled);
  };

  if (!classDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 p-6 text-white">
        <h1 className="text-3xl font-bold">Class Details</h1>
      </div>
      <div className="p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{classDetails.title}</h2>
          <p className="text-lg">{classDetails.description}</p>
          <EnrollStudent courseId={classId} onEnroll={handleEnroll} />
          <h3 className="text-xl font-semibold mt-4">Enrolled Students</h3>
          <ul>
            {enrolledStudents.map((student) => (
              <li key={student.id}>{student.username}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ClassDetails;
