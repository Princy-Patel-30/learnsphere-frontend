import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import { useCourse } from '../Context/CourseContext';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { fetchCourseDetails, enrollInCourse, fetchEnrolledCourses, setActiveSessionId, fetchRatingsForCourse } = useCourse();

  const [dropdownOpen, setDropdownOpen] = useState({});
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ratingsData, setRatingsData] = useState(null);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        const [details, enrolledCourses, ratings] = await Promise.all([fetchCourseDetails(courseId), fetchEnrolledCourses(), fetchRatingsForCourse(courseId)]);
        setCourse(details);
        setRatingsData(ratings);
        setIsEnrolled(enrolledCourses.some((c) => c.id === parseInt(courseId)));
      } catch (err) {
        toast.error('Error loading course information.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) loadCourseData();
  }, [courseId]);

  const toggleDropdown = (sessionId) => {
    setDropdownOpen((prev) => ({ ...prev, [sessionId]: !prev[sessionId] }));
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

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < count ? 'text-yellow-400' : 'text-gray-300'}
        fill={i < count ? 'currentColor' : 'none'}
      />
    ));
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
                  <div
                    className="mt-2 text-gray-600"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(session.content) }}
                  />
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

      {/* Ratings & Reviews Section */}
      {ratingsData && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Reviews ({ratingsData.totalRatings})</h2>

          {ratingsData.ratings.map((rating) => (
            <article
              key={rating.id}
              className="mb-6 border-b pb-4"
            >
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white mr-4">{rating.user.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p className="font-medium">{rating.user.name}</p>
                  <time className="text-sm text-gray-500">Reviewed on {new Date(rating.createdAt).toLocaleDateString()}</time>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex items-center space-x-1 mb-1">{renderStars(rating.stars)}</div>
                <p className="text-sm text-gray-700">{rating.review}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
