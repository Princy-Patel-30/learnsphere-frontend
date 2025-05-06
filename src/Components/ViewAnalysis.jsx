import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  getAnalytics,
  getCourseAnalytics,
  getCommentAnalytics,
} from '../Services/instructorService';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const ViewAnalysis = () => {
  const [analytics, setAnalytics] = useState(null);
  const [commentAnalytics, setCommentAnalytics] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, commentsData] = await Promise.all([
          getAnalytics(),
          getCommentAnalytics(),
        ]);
        setAnalytics(analyticsData);
        setCommentAnalytics(commentsData.commentAnalytics);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCourseClick = async (data) => {
    if (data?.activePayload?.[0]?.payload) {
      try {
        const courseData = await getCourseAnalytics(
          data.activePayload[0].payload.courseId
        );
        setSelectedCourse(courseData.course);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!analytics) return <div className="text-center py-10">No data available</div>;

  const { kpis, courseAnalytics, chartData } = analytics;

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Instructor Analytics Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Courses</h2>
          <p className="text-3xl font-bold text-blue-600">{kpis.totalCourses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Enrollments</h2>
          <p className="text-3xl font-bold text-blue-600">{kpis.totalEnrollments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Avg. Rating</h2>
          <p className="text-3xl font-bold text-blue-600">{kpis.avgRating}/5</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Enrollments Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Course Enrollments</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.enrollments} onClick={handleCourseClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="enrollments" fill="#4BC0C0" name="Enrollments" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.ratings}
                dataKey="count"
                nameKey="rating"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.ratings.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Comments Doughnut Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Comments Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={commentAnalytics}
                dataKey="totalComments"
                nameKey="courseTitle"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                label
              >
                {commentAnalytics.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Rates Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Completion Rates</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={courseAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avgCompletionRate" 
                stroke="#FF6384" 
                name="Completion Rate (%)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Course Details */}
      {selectedCourse && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">{selectedCourse.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-gray-600">Enrollments</p>
              <p className="text-xl font-bold">{selectedCourse.totalEnrollments}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Avg. Rating</p>
              <p className="text-xl font-bold">{selectedCourse.avgRating}/5</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Completion Rate</p>
              <p className="text-xl font-bold">{selectedCourse.avgCompletionRate}%</p>
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setSelectedCourse(null)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewAnalysis;