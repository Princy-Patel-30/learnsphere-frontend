import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentDashboard from './Components/StudentDashboard';
import CreateCourse from './Components/CreateCourse';
import Navbar from './Components/Navbar';
import CourseDetails from './Components/CourseDetails';
import EnrolledCourses from './Components/EnrolledCourses';
import Sessions from './Components/Sessions';
import MyProgress from './Components/MyProgress';
import InstructorDashboard from './Components/InstructorDashboard';
import SelectRole from './Components/SelectRole';
import LandingPage from './Components/Landing';
import DashboardProtectedRoute from './ProtectedRoutes/DashboardProtectedRoute';
function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
  path="/InstructorDashboard"
  element={
    <DashboardProtectedRoute allowedRoles={['INSTRUCTOR']}>
      <InstructorDashboard />
    </DashboardProtectedRoute>
  }
/>
<Route
  path="/StudentDashboard"
  element={
    <DashboardProtectedRoute allowedRoles={['STUDENT']}>
      <StudentDashboard />
    </DashboardProtectedRoute>
  }
/>
            <Route path="/createcourseform" element={<CreateCourse />} />
            <Route path="/courses/:courseId" element={<CourseDetails />} />
            <Route path="/EnrolledCourses" element={<EnrolledCourses />} />
            <Route path="/course-sessions/:courseId" element={<Sessions />} />
            <Route path="/my-progress" element={<MyProgress />} />
            <Route path="/select-role" element={<SelectRole/>} />
            <Route path = '/landing' element={<LandingPage/>}/>
            <Route path="/create-course" element={<CreateCourse />} />
          </Routes>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
