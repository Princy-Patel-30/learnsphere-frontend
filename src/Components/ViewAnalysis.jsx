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
  getRatingsOverTime,
  getCommentAnalytics,
} from '../Services/instructorService';

const ViewAnalysis = () => {
  const [analytics, setAnalytics] = useState(null);
  const [ratingsOverTime, setRatingsOverTime] = useState(null);
  const [commentAnalytics, setCommentAnalytics] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, ratingsData, commentsData] = await Promise.all([
          getAnalytics(),
          getRatingsOverTime('2024-11-06', '2025-05-06'), // Last 6 months
          getCommentAnalytics(),
        ]);
        setAnalytics(analyticsData);
        setRatingsOverTime(ratingsData.chartData);
        setCommentAnalytics(commentsData.commentAnalytics);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle course selection from bar chart
  const handleCourseClick = async (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const courseId = analytics.courseAnalytics.find(
        (course) => course.title === data.activePayload[0].payload.name
      )?.courseId;
      if (courseId) {
        try {
          const courseData = await getCourseAnalytics(courseId);
          setSelectedCourse(courseData.course);
        } catch (err) {
          setError(err.message);
        }
      }
    }
  };

  // Handle loading and error states
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!analytics) return <div className="text-center py-10">No data available</div>;

  const { kpis, courseAnalytics, chartData } = analytics;

  // Prepare data for Recharts
  const enrollmentData = chartData.enrollments.labels.map((label, index) => ({
    name: label,
    enrollments: chartData.enrollments.data[index],
  }));

  const ratingData = chartData.ratings.labels.map((label, index) => ({
    name: label,
    value: chartData.ratings.data[index],
  }));

  const completionData = courseAnalytics.map((course) => ({
    name: course.title,
    completionRate: parseFloat(course.avgCompletionRate),
  }));

  // Colors for pie chart
  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Instructor Analytics Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Courses</h2>
          <p className="text-3xl font-bold text-blue-600">{kpis.totalCourses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Enrollments</h2>
          <p className="text-3xl font-bold text-blue-600">{kpis.totalEnrollments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Avg. Completion Rate</h2>
          <p className="text-3xl font-bold text-blue-600">{kpis.avgCompletionRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Total Ratings</h2>
          <p className="text-3xl font-bold text-blue-600">{kpis.totalRatings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold text-gray-700">Avg. Rating</h2>
          <p className="text-3xl font-bold text-blue-600">{kpis.avgRating} / 5</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Enrollments per Course</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enrollmentData} onClick={handleCourseClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="enrollments" fill="#4BC0C0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ratingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {ratingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Average Completion Rate per Course</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completionRate" stroke="#FF6384" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Ratings Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgRating" stroke="#36A2EB" name="Average Rating" />
              <Line type="monotone" dataKey="count" stroke="#9966FF" name="Number of Ratings" yAxisId="right" />
              <YAxis yAxisId="right" orientation="right" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected Course Analytics */}
      {selectedCourse && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Selected Course: {selectedCourse.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-gray-600">Enrollments</p>
              <p className="text-lg font-bold">{selectedCourse.totalEnrollments}</p>
            </div>
            <div>
              <p className="text-gray-600">Avg. Completion Rate</p>
              <p className="text-lg font-bold">{selectedCourse.avgCompletionRate}%</p>
            </div>
            <div>
              <p className="text-gray-600">Avg. Rating</p>
              <p className="text-lg font-bold">{selectedCourse.avgRating} / 5</p>
            </div>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Student Progress</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3 text-gray-700">Student Name</th>
                  <th className="p-3 text-gray-700">Email</th>
                  <th className="p-3 text-gray-700">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourse.completionData.map((data) => (
                  <tr key={data.user.id} className="border-b">
                    <td className="p-3">{data.user.name}</td>
                    <td className="p-3">{data.user.email}</td>
                    <td className="p-3">{data.completionRate.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setSelectedCourse(null)}
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Course Analytics */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Course Analytics</h2>
        <div className="grid grid-cols-1 gap-6">
          {courseAnalytics.map((course) => (
            <div key={course.courseId} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Enrollments</p>
                  <p className="text-lg font-bold">{course.totalEnrollments}</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg. Completion Rate</p>
                  <p className="text-lg font-bold">{course.avgCompletionRate}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg. Rating</p>
                  <p className="text-lg font-bold">{course.avgRating} / 5</p>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Student Progress</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 text-gray-700">Student Name</th>
                      <th className="p-3 text-gray-700">Email</th>
                      <th className="p-3 text-gray-700">Completion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.completionData.map((data) => (
                      <tr key={data.user.id} className="border-b">
                        <td className="p-3">{data.user.name}</td>
                        <td className="p-3">{data.user.email}</td>
                        <td className="p-3">{data.completionRate.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Analytics */}
      {commentAnalytics && commentAnalytics.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Comment Analytics</h2>
          <div className="grid grid-cols-1 gap-6">
            {commentAnalytics.map((courseComments) => (
              <div key={courseComments.courseId} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {courseComments.courseTitle} ({courseComments.totalComments} Comments)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-3 text-gray-700">User</th>
                        <th className="p-3 text-gray-700">Comment</th>
                        <th className="p-3 text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseComments.comments.map((comment, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3">{comment.user.name} ({comment.user.email})</td>
                          <td className="p-3">{comment.content}</td>
                          <td className="p-3">{new Date(comment.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAnalysis;