import api from '../utils/api';

export const getInstructorCourses = async () => {
  const response = await api.get('/courses/my-courses', { withCredentials: true });
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post('/courses', courseData, { withCredentials: true });
  return response.data;
};

export const updateCourse = async (courseId, courseData) => {
  const response = await api.put(`/courses/${courseId}`, courseData, { withCredentials: true });
  return response.data;
};

export const deleteCourse = async (courseId) => {
  await api.delete(`/courses/${courseId}`, { withCredentials: true });
};

// Analytics endpoints
export const getAnalytics = async () => {
  const response = await api.get('/instructor/analytics', { withCredentials: true });
  return response.data;
};

export const getCourseAnalytics = async (courseId) => {
  const response = await api.get(`/instructor/analytics/courses/${courseId}`, { withCredentials: true });
  return response.data;
};

export const getCommentAnalytics = async () => {
  const response = await api.get('/instructor/analytics/comments', { withCredentials: true });
  return response.data;
};