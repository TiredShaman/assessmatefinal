const API_URL = import.meta.env.VITE_API_URL;
const GOOGLE_AUTH_URL = import.meta.env.VITE_GOOGLE_AUTH_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_URL}/api/auth/signin`,
  REGISTER: `${API_URL}/api/auth/signup`,
  GOOGLE_AUTH: GOOGLE_AUTH_URL,
  VALIDATE_TOKEN: `${API_URL}/api/auth/validate`,
  
  // Teacher endpoints
  TEACHER: {
    COURSES: `${API_URL}/api/teachers/courses`,
    COURSE: (id) => `${API_URL}/api/teachers/courses/${id}`,
    QUIZZES: `${API_URL}/api/teachers/quizzes`,
    QUIZ: (id) => `${API_URL}/api/teachers/quizzes/${id}`,
    QUIZ_ACTIVATE: (id) => `${API_URL}/api/teachers/quizzes/${id}/activate`,
    ENROLL_STUDENT: `${API_URL}/api/teachers/enroll-student`,
    STATS: {
      TOTAL_COURSES: `${API_URL}/api/teachers/stats/total-courses`,
      TOTAL_QUIZZES: `${API_URL}/api/teachers/stats/total-quizzes`,
      TOTAL_STUDENTS: `${API_URL}/api/teachers/stats/total-enrolled-students`,
      ACTIVE_QUIZZES: `${API_URL}/api/teachers/stats/active-quizzes`,
    }
  },

  // Student endpoints
  STUDENT: {
    COURSES: `${API_URL}/api/students/courses`,
    COURSE_QUIZZES: (courseId) => `${API_URL}/api/students/courses/${courseId}/quizzes`,
    GRADES: `${API_URL}/api/students/grades`,
    SUBMISSIONS: `${API_URL}/api/students/submissions`,
  },

  // User endpoints
  USER: {
    PROFILE: `${API_URL}/api/user/profile`,
    UPDATE: `${API_URL}/api/user/update`,
    ROLE: `${API_URL}/api/user/role`,
  }
};

export const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Example API function
export const loginUser = async (credentials) => {
  const response = await fetch(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// Add other API functions here using API_ENDPOINTS