import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourse } from '../Context/CourseContext';
import { BookOpenCheck, User, GraduationCap } from 'lucide-react';

const EnrolledCourses = () => {
  const { fetchEnrolledCourses } = useCourse();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const courses = await fetchEnrolledCourses();
        setEnrolledCourses(courses);
      } catch (error) {
        console.error('Failed to fetch enrolled courses:', error);
      }
    };

    fetchEnrolled();
  }, [fetchEnrolledCourses]);

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 font-sans">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-800 mb-10 text-center flex items-center justify-center gap-2">
        <GraduationCap className="text-purple-700" size={28} />
        Your Enrolled Courses
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className="bg-purple-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full capitalize">
                  {course.category}
                </span>
                <BookOpenCheck className="text-purple-600" size={20} />
              </div>

              <h2 className="text-lg sm:text-2xl font-bold text-purple-800 text-center mb-2">
                {course.title}
              </h2>

              <p className="text-sm text-purple-700 mb-4 text-center line-clamp-3">
                {course.description}
              </p>

              <div className="mt-auto flex items-center justify-center text-m text-purple-900">
                <User className="mr-2" size={16} />
                Instructor: {course.instructor?.name || 'N/A'}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-purple-700 text-base">
            You have not enrolled in any courses yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;
