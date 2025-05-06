import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useCourse } from '../Context/CourseContext';
import {
  BookOpen,
  CheckCircle,
  ArrowRight,
  Loader2,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RatingModal from './RatingModal';

const MyProgress = () => {
  const { fetchEnrolledCourses, fetchCourseProgress } = useCourse();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const courses = await fetchEnrolledCourses();
        setEnrolledCourses(courses);

        const progressResults = await Promise.all(
          courses.map(async (course) => {
            const progress = await fetchCourseProgress(course.id);
            return {
              courseId: course.id,
              completed: progress.completedSessions || 0,
              total: progress.totalSessions || 0,
              percentage:
                progress.totalSessions > 0
                  ? (progress.completedSessions / progress.totalSessions) * 100
                  : 0,
            };
          })
        );

        const progressData = {};
        progressResults.forEach((p) => {
          progressData[p.courseId] = p;
        });

        setProgressMap(progressData);
      } catch (error) {
        console.error('Failed to load progress data:', error);
        toast.error('Unable to fetch progress.');
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [fetchEnrolledCourses, fetchCourseProgress]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      <h2 className="text-4xl font-extrabold text-purple-800 mb-10 text-center flex items-center justify-center gap-3">
        <BookOpen className="h-8 w-8 text-purple-600" />
        My Learning Progress
      </h2>

      {enrolledCourses.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-2xl shadow-lg max-w-md mx-auto">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-700 mb-4">
            No courses enrolled yet!
          </p>
          <p className="text-gray-500 mb-6">
            Kickstart your learning journey by exploring our courses.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Explore Courses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const progress = progressMap[course.id] || {
              completed: 0,
              total: 0,
              percentage: 0,
            };

            return (
              <div
                key={course.id}
                className="bg-purple-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col"
              >
                <div className="flex items-center mb-3">
                  <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
                  <h3 className="text-2xl font-semibold text-purple-800">
                    {course.title}
                  </h3>
                </div>

                <p className="text-m text-purple-700 mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-m font-medium text-purple-700">
                      Progress: {progress.percentage.toFixed(2)}%
                    </span>
                    {progress.percentage >= 50 && (
                      <span className="flex items-center text-xs text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Milestone!
                      </span>
                    )}
                  </div>
                  <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-4 rounded-full transition-all duration-700 ease-in-out"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-s text-purple-700 mt-2">
                    {progress.completed} / {progress.total} sessions completed
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <Link
                    to={`/courses/${course.id}`}
                    className="inline-flex items-center text-sm text-purple-700 hover:text-purple-900 font-medium"
                  >
                    View Course Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setSelectedCourseId(course.id)}
                    className="inline-flex items-center text-sm text-purple-700 hover:text-purple-900 font-medium"
                  >
                    Rate Course
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <RatingModal
        isOpen={!!selectedCourseId}
        onClose={() => setSelectedCourseId(null)}
        courseId={selectedCourseId}
      />
    </div>
  );
};

export default MyProgress;