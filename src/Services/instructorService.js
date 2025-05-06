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

export const getAnalytics = async () => {
  const response = await api.get('/instructor/analytics', { withCredentials: true });
  return response.data;
};

export const getCourseAnalytics = async (courseId) => {
  const response = await api.get(`/instructor/analytics/course/${courseId}`, { withCredentials: true });
  return response.data;
};

export const getStudentAnalytics = async (userId) => {
  const response = await api.get(`/instructor/analytics/student/${userId}`, { withCredentials: true });
  return response.data;
};

export const getRatingsOverTime = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await api.get('/instructor/analytics/ratings-over-time', {
    params,
    withCredentials: true,
  });
  return response.data;
};

export const getCommentAnalytics = async () => {
  const response = await api.get('/instructor/analytics/comments', { withCredentials: true });
  return response.data;
};