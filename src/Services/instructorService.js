import api from '../utils/api';

export const getInstructorCourses = async () => {
  const response = await api.get('/courses/my-courses', { withCredentials: true });
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post('/courses', courseData, { withCredentials: true });
  return response.data;
};

export const deleteCourse = async (courseId) => {
  await api.delete(`/courses/${courseId}`, { withCredentials: true });
};