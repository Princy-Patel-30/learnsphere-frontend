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

export const createRating = async (courseId, stars, review) => {
    const response = await api.post(
      `/student/courses/${courseId}/rate`,
      { stars, review },
      { withCredentials: true }
    );
    return response.data;
  };
  
  export const getCourseRatings = async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}/ratings`);
    return response.data;
  };
  
  export const addCommentToRating = async (ratingId, content) => {
    const response = await api.post(
      `/student/ratings/${ratingId}/comment`,
      { content },
      { withCredentials: true }
    );
    return response.data;
  };
  
  export const getCommentsForRating = async (ratingId) => {
    const response = await api.get(`/student/ratings/${ratingId}/comments`);
    return response.data;
  };
