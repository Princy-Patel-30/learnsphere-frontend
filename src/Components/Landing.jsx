import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-20 bg-purple-50 text-gray-900 font-sans min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-900 to-purple-600 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">
            Transform Your Future with LearnSphere
          </h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover a cutting-edge Learning Management System crafted to empower students and educators with seamless, engaging, and personalized learning experiences.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="cursor-pointer bg-white text-purple-800 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            Join a Course Today
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-purple-800 mb-12">Why Choose LearnSphere?</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-8 bg-purple-50 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">World-Class Instructors</h3>
              <p className="text-gray-700 leading-relaxed">
                Gain insights from industry experts and seasoned professionals dedicated to your success.
              </p>
            </div>
            <div className="p-8 bg-purple-50 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">Flexible Learning</h3>
              <p className="text-gray-700 leading-relaxed">
                Access courses anytime, anywhere, with flexible schedules and lifetime course access.
              </p>
            </div>
            <div className="p-8 bg-purple-50 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-semibold mb-3 text-purple-700">Engaging Community</h3>
              <p className="text-gray-700 leading-relaxed">
                Connect with peers, participate in forums, and attend live sessions for a richer experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-purple-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-12">Our Impact in Numbers</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-4xl font-bold text-purple-900">10K+</p>
              <p className="text-gray-700">Active Learners</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-900">500+</p>
              <p className="text-gray-700">Courses Available</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-900">200+</p>
              <p className="text-gray-700">Expert Instructors</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-900">95%</p>
              <p className="text-gray-700">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-12">What Our Students Say</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-purple-50 rounded-2xl shadow-md">
              <p className="text-gray-700 italic mb-4">"LearnSphere transformed my career with its practical courses and expert guidance."</p>
              <p className="font-semibold text-purple-800">Sarah M., Data Analyst</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-2xl shadow-md">
              <p className="text-gray-700 italic mb-4">"The flexibility and support made learning enjoyable and effective."</p>
              <p className="font-semibold text-purple-800">James T., Freelancer</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-2xl shadow-md">
              <p className="text-gray-700 italic mb-4">"I love the interactive sessions and ability to engage with instructors."</p>
              <p className="font-semibold text-purple-800">Anita R., Student</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-700 to-purple-500 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Start Your Learning Journey Today</h2>
          <p className="text-lg mb-8">
            Join thousands of learners and explore a world of knowledge, flexibility, and community.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="cursor-pointer bg-white text-purple-800 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-purple-100 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
