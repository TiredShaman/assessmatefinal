import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import OAuth2Redirect from "./components/auth/OAuth2Redirect";
import EnhancedLandingPage from "./components/landing/EnhancedLandingPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AuthCallback from "./components/auth/AuthCallback";
import TeacherDashboard from "./components/dashboard/TeacherDashboard";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import CreateClass from "./components/pages/CreateCourse";
import ViewClasses from "./components/pages/ViewCourses";
import ClassDetails from "./components/pages/ClassDetails";
import AddStudentToCourse from "./components/pages/AddStudentToCourse";
import CreateQuiz from "./components/pages/CreateQuiz";
import AddQuestionToQuiz from "./components/pages/AddQuestionToQuiz";
import ViewQuizSubmissions from "./components/pages/ViewQuizSubmissions";
import GradeSubmission from "./components/pages/GradeSubmission";
import ViewQuiz from "./components/pages/ViewQuiz";
import EnrollStudent from "./components/pages/EnrollStudent";
import ViewCourses from "./components/pages/ViewCourses";
import AvailableQuizzes from "./components/pages/AvailableQuizzes";
import StudentGrades from "./components/pages/StudentGrades";
import StudentCourses from "./components/pages/StudentCourses";
import TakeQuiz from "./components/pages/TakeQuiz";
import EditQuiz from "./components/pages/EditQuiz";
import EditQuizQuestions from "./components/pages/EditQuizQuestions";
import './App.css';
import './index.css';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Memoize user to prevent unnecessary re-renders
  const memoizedUser = useMemo(() => user, [user]);

  useEffect(() => {
    console.log("App - useEffect - user:", memoizedUser);
    if (memoizedUser) {
      localStorage.setItem("user", JSON.stringify(memoizedUser));
      localStorage.setItem("token", memoizedUser.token);
      if (Array.isArray(memoizedUser.roles) && memoizedUser.roles.length > 0) {
        localStorage.setItem("role", memoizedUser.roles[0]);
      } else {
        console.warn("App - No valid roles found, clearing role");
        localStorage.removeItem("role");
        setUser(null); // Clear user if roles are invalid
      }
    } else {
      console.log("App - Clearing localStorage");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }, [memoizedUser?.roles]);

  const token = memoizedUser ? memoizedUser.token : null;
  const role = memoizedUser && Array.isArray(memoizedUser.roles) && memoizedUser.roles.length > 0 ? memoizedUser.roles[0] : null;

  return (
    <GoogleOAuthProvider clientId="797136146317-4b8bnfsc79n2smv9tbj43duufi70l7t0.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={!token ? <EnhancedLandingPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" replace />} />
          <Route
            path="/login"
            element={!token ? <Login setUser={setUser} /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/auth/callback"
            element={<AuthCallback setUser={setUser} />}
          />
          <Route
            path="/dashboard"
            element={token && role ? (
              role === "ROLE_TEACHER" ? (
                <TeacherDashboard user={memoizedUser} />
              ) : role === "ROLE_STUDENT" ? (
                <StudentDashboard user={memoizedUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )}
          />
          <Route
            path="/create-class"
            element={token && role === "ROLE_TEACHER" ? <CreateClass user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/view-classes"
            element={token && role === "ROLE_TEACHER" ? <ViewClasses user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/class-details/:classId"
            element={token && role === "ROLE_TEACHER" ? <ClassDetails user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/teacher/add-student-to-course/:courseId"
            element={token && role === "ROLE_TEACHER" ? <AddStudentToCourse user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/teacher/create-quiz"
            element={token && role === "ROLE_TEACHER" ? <CreateQuiz user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/teacher/add-question-to-quiz/:quizId"
            element={token && role === "ROLE_TEACHER" ? <AddQuestionToQuiz user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/teacher/view-quizzes"
            element={token && role === "ROLE_TEACHER" ? <ViewQuiz user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/teacher/edit-quiz/:quizId"
            element={token && role === "ROLE_TEACHER" ? <EditQuiz user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/teacher/edit-quiz/:quizId/questions"
            element={token && role === "ROLE_TEACHER" ? <EditQuizQuestions user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/teacher/grade-submission/:submissionId"
            element={token && role === "ROLE_TEACHER" ? <GradeSubmission user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/enroll-student"
            element={token && role === "ROLE_TEACHER" ? <EnrollStudent user={memoizedUser} onEnroll={() => {}} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/student/view-courses"
            element={token && role === "ROLE_STUDENT" ? <StudentCourses user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/student/grades"
            element={token && role === "ROLE_STUDENT" ? <StudentGrades user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            débuts
            path="/student/courses/:courseId/quizzes"
            element={token && role === "ROLE_STUDENT" ? <AvailableQuizzes user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/student/dashboard"
            element={token && role === "ROLE_STUDENT" ? <StudentDashboard user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/student/take-quiz/:quizId"
            element={token && role === "ROLE_STUDENT" ? <TakeQuiz user={memoizedUser} /> : <Navigate to="/login" replace />}
          />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
          <Route path="*" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
