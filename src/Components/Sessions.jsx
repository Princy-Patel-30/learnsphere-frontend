import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ReactPlayer from 'react-player';
import { useCourse } from '../Context/CourseContext';

const NetworkFallback = () => (
  <p className="text-center text-gray-500 mt-4">Unable to load video. Check your network or video URL.</p>
);

const Sessions = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    fetchCourseSessions,
    fetchCourseDetails,
    courseSessions,
    markAsComplete,
    activeSessionId,
    setActiveSessionId,
    courseDetails,
  } = useCourse();

  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVideoError, setHasVideoError] = useState(false);

  const sessions = courseSessions[courseId] || [];
  const currentIndex = sessions.findIndex((s) => s.id === currentSessionId);
  const currentSession = sessions[currentIndex];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchCourseSessions(courseId),
          fetchCourseDetails(courseId),
        ]);
      } catch {
        toast.error('Failed to load sessions or course details.');
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchAll();
  }, [courseId]);

  useEffect(() => {
    if (sessions.length > 0) {
      const defaultId = activeSessionId || sessions[0].id;
      setCurrentSessionId(defaultId);
      setActiveSessionId(defaultId);
    }
  }, [sessions, activeSessionId]);

  const handleMarkComplete = async () => {
    try {
      await markAsComplete(currentSessionId);
      toast.success('Marked as complete!');
    } catch {
      toast.error('Error completing session.');
    }
  };

  const handleNavigation = (direction) => {
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (sessions[newIndex]) {
      const newId = sessions[newIndex].id;
      setCurrentSessionId(newId);
      setActiveSessionId(newId);
      setHasVideoError(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading sessions...</p>;
  if (!sessions.length || !currentSession) return <p className="text-center mt-10">No sessions found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-center">{courseDetails[courseId]?.title || 'Course'}</h1>
      </div>

      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">{currentSession.title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/my-progress')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Progress
          </button>
          <button
            onClick={handleMarkComplete}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Mark Complete
          </button>
        </div>
      </div>

      <Suspense fallback={<p className="text-center mt-4">Loading video...</p>}>
        {hasVideoError ? (
          <NetworkFallback />
        ) : (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${currentSession.videoUrl}`}
            width="100%"
            height="400px"
            playing={true}
            controls
            onError={() => setHasVideoError(true)}
          />
        )}
      </Suspense>

      <div
        className="mt-6 text-gray-800 prose"
        dangerouslySetInnerHTML={{ __html: currentSession.content }}
      />

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => handleNavigation('prev')}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <span className="text-sm text-gray-600">
          Session {currentIndex + 1} / {sessions.length}
        </span>
        <button
          onClick={() => handleNavigation('next')}
          disabled={currentIndex === sessions.length - 1}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ArrowRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default Sessions;
