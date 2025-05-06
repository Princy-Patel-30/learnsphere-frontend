import React, { useEffect, useState } from 'react';
import { getInstructorCourses, deleteCourse } from '../Services/instructorService';
import { BookPlus, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getInstructorCourses();
      setInstructorCourses(data);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = () => {
    navigate('/create-course');
  };

  const handleUpdateCourse = (course) => {
    navigate('/create-course', { state: { course } });
  };

  const confirmDelete = (courseId) => {
    setCourseToDelete(courseId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCourse(courseToDelete);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (err) {
      toast.error('Failed to delete course');
    } finally {
      setIsModalOpen(false);
      setCourseToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCourseToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this course? This action cannot be undone."
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Your Courses</h1>
        <button
          onClick={handleCreateCourse}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          <BookPlus size={20} />
          Create Course
        </button>
      </div>

      {instructorCourses.length === 0 ? (
        <div className="text-center bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg text-gray-600">You haven't created any courses yet. Start creating now!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructorCourses.map((course) => (
            <div
              key={course.id}
              className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => handleUpdateCourse(course)}
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => confirmDelete(course.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">{course.title}</h2>
              <div className="mb-4 text-sm text-gray-700 prose">
                {parse(DOMPurify.sanitize(course.description))}
              </div>
              <p className="text-xs text-purple-500">Category: {course.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;