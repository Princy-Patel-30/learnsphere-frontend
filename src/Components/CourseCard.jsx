import React from 'react';
import { BookOpen, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCourse } from '../Context/CourseContext';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { enrollInCourse } = useCourse();

  const handleCardClick = () => {
    navigate(`/courses/${course.id}`);
  };

  const handleEnrollClick = async (e) => {
    e.stopPropagation();
    try {
      await enrollInCourse(course.id);
      toast.success('🎉 Successfully enrolled!');
      setTimeout(() => {
        navigate('/EnrolledCourses');
      }, 1000);
    } catch (error) {
      toast.error('Failed to enroll in course.');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-purple-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col relative w-full h-auto cursor-pointer group"
    >
      <span className="absolute top-4 right-4 text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full z-10 flex items-center space-x-1">
        <BookOpen className="w-4 h-4" />
        <span>{course.category}</span>
      </span>

      <div className="bg-gray-50 px-4 py-4 rounded-lg mt-10 mb-4 border border-purple-200">
        <h3 className="text-2xl font-bold text-purple-700 text-center group-hover:text-purple-900 transition">{course.title}</h3>
      </div>

      <p className="text-sm text-purple-800 leading-relaxed mb-4">
        {course.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center text-sm text-gray-700"></div>
        <button
          onClick={handleEnrollClick}
          className="flex items-center space-x-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Enroll</span>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
