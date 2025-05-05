import React, { useEffect, useState } from 'react';
import { useInstructor } from '../Context/InstructorContext';
import { BookPlus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full transform transition-all duration-300 scale-100"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <h2 id="modal-title" className="text-xl font-semibold text-gray-800 mb-4">
          {title}
        </h2>
        <p id="modal-description" className="text-gray-600 mb-6">
          {message}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const InstructorDashboard = () => {
  const { instructorCourses, loading, error, fetchInstructorCourses, deleteCourse } = useInstructor();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Fetch instructor courses on component mount
  useEffect(() => {
    fetchInstructorCourses();
  }, [fetchInstructorCourses]);

  const handleCreateCourse = () => {
    navigate('/create-course');
  };

  const confirmDelete = (courseId) => {
    setCourseToDelete(courseId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCourse(courseToDelete);
      setIsModalOpen(false);
      setCourseToDelete(null);
    } catch (err) {
      toast.error('Failed to delete course.');
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
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <style>
        {`
          .course-description p {
            margin-bottom: 0.75rem;
            line-height: 1.5;
          }
          .course-description h1, .course-description h2, .course-description h3 {
            margin-top: 1rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
          }
          .course-description ul {
            list-style-type: disc;
            margin-left: 1.25rem;
            margin-bottom: 0.75rem;
          }
          .course-description li {
            margin-bottom: 0.25rem;
          }
          .course-description strong {
            font-weight: 700;
          }
          .course-description em {
            font-style: italic;
          }
        `}
      </style>

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
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-200 ease-in-out"
        >
          <BookPlus size={20} />
          Create Course
        </button>
      </div>

      {instructorCourses.length === 0 ? (
        <div className="text-center bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg text-gray-600">
            You haven't created any courses yet. Start creating now!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructorCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3">{course.title}</h2>
              <div className="mb-4 text-sm text-gray-700 prose course-description">
                {course.description}
              </div>
              <p className="mt-2 text-xs text-purple-500">Category: {course.category}</p>
              <button
                onClick={() => confirmDelete(course.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors duration-200"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;