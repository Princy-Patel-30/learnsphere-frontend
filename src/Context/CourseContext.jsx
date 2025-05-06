import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  getPublishedCourses,
  getEnrolledCourses,
  getCourseDetails,
  getCourseSessions,
  enrollInCourse as apiEnroll,
  markSessionComplete,
  getCourseProgress,
  createRating,
  getCourseRatings,
  addCommentToRating,
  getCommentsForRating
} from '../Services/courseService';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [courseDetails, setCourseDetails] = useState({});
  const [courseSessions, setCourseSessions] = useState({});
  const [sessionProgress, setSessionProgress] = useState({});
  const [courseRatings, setCourseRatings] = useState({});
  const [ratingComments, setRatingComments] = useState({});
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Course-related fetch functions (existing)...

  const fetchEnrolledCourses = async () => {
    if (enrolledCourses.length > 0) return enrolledCourses;
    setLoading(true);
    try {
      const data = await getEnrolledCourses();
      setEnrolledCourses(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishedCourses = async () => {
    if (publishedCourses.length > 0) return publishedCourses;
    setLoading(true);
    try {
      const data = await getPublishedCourses();
      setPublishedCourses(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    if (courseDetails[courseId]) return courseDetails[courseId];
    setLoading(true);
    try {
      const data = await getCourseDetails(courseId);
      setCourseDetails((prev) => ({ ...prev, [courseId]: data }));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseSessions = async (courseId) => {
    setLoading(true);
    try {
      const data = await getCourseSessions(courseId);
      setCourseSessions((prev) => ({ ...prev, [courseId]: data }));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseProgress = async (courseId) => {
    setLoading(true);
    try {
      const data = await getCourseProgress(courseId);
      setSessionProgress((prev) => ({ ...prev, [courseId]: data }));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async (sessionId) => {
    try {
      await markSessionComplete(sessionId);
      const courses = await fetchEnrolledCourses();
      setEnrolledCourses(courses);
    } catch (err) {
      throw err;
    }
  };

  const enrollInCourse = async (courseId) => {
    await apiEnroll(courseId);
    setEnrolledCourses([]); // Clear to force refresh
  };

  // ============================
  // ⭐ Ratings and Comments Logic
  // ============================

  const fetchRatingsForCourse = async (courseId) => {
    setLoading(true);
    try {
      const data = await getCourseRatings(courseId);
      setCourseRatings((prev) => ({ ...prev, [courseId]: data }));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (courseId, stars, review) => {
    await createRating(courseId, stars, review);
    await fetchRatingsForCourse(courseId); // Refresh ratings
  };

  const fetchCommentsForRating = async (ratingId) => {
    setLoading(true);
    try {
      const data = await getCommentsForRating(ratingId);
      setRatingComments((prev) => ({ ...prev, [ratingId]: data }));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (ratingId, content) => {
    await addCommentToRating(ratingId, content);
    await fetchCommentsForRating(ratingId); // Refresh comments
  };

  const value = useMemo(() => ({
    enrolledCourses,
    publishedCourses,
    courseDetails,
    courseSessions,
    sessionProgress,
    courseRatings,
    ratingComments,
    loading,
    error,
    fetchEnrolledCourses,
    fetchPublishedCourses,
    fetchCourseDetails,
    fetchCourseSessions,
    fetchCourseProgress,
    markAsComplete,
    enrollInCourse,
    activeSessionId,
    setActiveSessionId,
    fetchRatingsForCourse,
    submitRating,
    fetchCommentsForRating,
    submitComment
  }), [
    enrolledCourses,
    publishedCourses,
    courseDetails,
    courseSessions,
    sessionProgress,
    courseRatings,
    ratingComments,
    loading,
    error,
    activeSessionId
  ]);

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourse = () => useContext(CourseContext);
