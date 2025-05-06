import React, { useState } from 'react';
import { useCourse } from '../Context/CourseContext';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';

const RatingModal = ({ isOpen, onClose, courseId }) => {
  const { submitRating } = useCourse();
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleStarClick = (value) => setStars(value);

  const handleSubmit = async () => {
    if (stars === 0) return;
    setSubmitting(true);
    try {
      await submitRating(courseId, stars, review);
      toast.success('Rating posted successfully');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
      onClose();
    } catch (error) {
      console.error('Rating submission failed', error);
      toast.error('Failed to post rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 60 }}
        />
      )}
      <div className="bg-white rounded-xl shadow-lg p-12 w-full max-w-xl relative z-10">
        <h2 className="text-gray-800 text-3xl text-center font-semibold mb-5">
          Rate your Experience!
        </h2>
        <div className="bg-gray-200 w-full flex flex-col items-center py-6">
          <span className="text-lg text-gray-800 mb-3">How were you satisfied with course?</span>
          <div className="flex space-x-3 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                className={`w-12 h-12 cursor-pointer ${i <= stars ? 'text-yellow-500' : 'text-gray-500'}`}
                onClick={() => handleStarClick(i)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <textarea
            rows={3}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="leave us a review"
            className="w-3/4 p-4 text-gray-500 rounded-xl resize-none mb-8"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || stars === 0}
            className="py-3 px-6 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white hover:from-purple-600 hover:to-indigo-700 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Rate Course'}
          </button>
        </div>
        <div className="h-20 flex items-center justify-center">
          <button
            onClick={onClose}
            className="py-3 px-6 text-lg bg-purple-500 rounded-xl text-white hover:bg-purple-600 transition"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;