import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCourse } from '../Context/CourseContext';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    fetchCourseDetails,
    enrollInCourse,
    fetchEnrolledCourses,
    setActiveSessionId,
  } = useCourse();

  const [dropdownOpen, setDropdownOpen] = useState({});
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        const [details, enrolledCourses] = await Promise.all([
          fetchCourseDetails(courseId),
          fetchEnrolledCourses(),
        ]);

        setCourse(details);
        const enrolled = enrolledCourses.some(c => c.id === parseInt(courseId));
        setIsEnrolled(enrolled);
      } catch (err) {
        toast.error('Error loading course information.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) loadCourseData();
  }, [courseId]);

  const toggleDropdown = (sessionId) => {
    setDropdownOpen(prev => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  const handleEnrollClick = async (e) => {
    e.stopPropagation();
    try {
      await enrollInCourse(course.id);
      toast.success('🎉 Successfully enrolled!');
      setIsEnrolled(true);
      navigate('/EnrolledCourses');
    } catch {
      toast.error('Failed to enroll in course.');
    }
  };

  const handleSessionClick = (sessionId) => {
    setActiveSessionId(sessionId);
    navigate(`/course-sessions/${courseId}`);
  };

  if (loading) return <p className="text-center text-lg">Loading course details...</p>;
  if (!course) return <p className="text-center text-lg">No course found.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-4">{course.title}</h1>
      <p className="text-lg text-gray-700 mb-4">{course.description}</p>
      <p className="text-md text-gray-600 mb-4">
        Category: <strong>{course.category}</strong>
      </p>
      <p className="text-md text-gray-600 mb-4">
        Instructor: <strong>{course.instructor?.name}</strong>
      </p>

      {course.sessions?.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sessions:</h2>
          <ul className="space-y-4">
            {course.sessions.map((session) => (
              <li
                key={session.id}
                className="border-b pb-4 cursor-pointer hover:bg-gray-50 rounded transition"
                onClick={() => handleSessionClick(session.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium text-lg">{session.title}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(session.id);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
                {dropdownOpen[session.id] && (
                  <div className="mt-2 text-gray-600" dangerouslySetInnerHTML={{ __html: session.content }} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center mt-6">
        {!isEnrolled ? (
          <button
            onClick={handleEnrollClick}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            Enroll in Course
          </button>
        ) : (
          <button
            onClick={() => navigate(`/sessions/${courseId}`)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Start Course
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
