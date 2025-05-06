import { createContext, useContext, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { getInstructorCourses, createCourse, deleteCourse, updateCourse } from '../Services/instructorService';
import React from 'react';

const InstructorContext = createContext();

export const InstructorProvider = ({ children }) => {
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInstructorCourses = async () => {
    setLoading(true);
    try {
      const data = await getInstructorCourses();
      setInstructorCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitCourse = async (course) => {
    try {
      await createCourse(course);
      toast.success('Course created successfully');
      fetchInstructorCourses();
    } catch (err) {
      toast.error('Failed to create course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      toast.success('Course deleted successfully');
      fetchInstructorCourses();
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const handleUpdateCourse = async (courseId, courseData) => {
    try {
      await updateCourse(courseId, courseData);
      toast.success('Course updated successfully');
      fetchInstructorCourses();
    } catch (err) {
      toast.error('Failed to update course');
    }
  };

  const value = useMemo(
    () => ({
      instructorCourses,
      loading,
      error,
      fetchInstructorCourses,
      submitCourse,
      handleDeleteCourse,
      handleUpdateCourse,
    }),
    [instructorCourses, loading, error]
  );

  return <InstructorContext.Provider value={value}>{children}</InstructorContext.Provider>;
};

export const useInstructor = () => useContext(InstructorContext);