import api from '../utils/api';

export const getPublishedCourses = async () => {
  const response = await api.get('/student/courses');
  return response.data;
};

export const getCourseDetails = async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}`);
    return response.data;
  };

  export const enrollInCourse = async (courseId) => {
    const response = await api.post(`/student/enroll/${courseId}`, {}, { withCredentials: true });
    return response.data;
  };

export const getEnrolledCourses = async () => {
  const response = await api.get('/student/my-courses', { withCredentials: true });
  return response.data;
};

export const getCourseSessions = async (courseId) => {
  const response = await api.get(`/student/course-sessions/${courseId}`);
  return response.data;
};

export const getCourseProgress = async (courseId) => {
const response = await api.get(`/student/course-progress/${courseId}`);
return response.data;
};

export const markSessionComplete = async (sessionId) => {
  const response = await api.post(`/student/complete-session/${sessionId}`, {}, { withCredentials: true });
  return response.data;
};

