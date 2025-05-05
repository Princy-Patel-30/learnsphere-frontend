import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { user, handleLogout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const studentLinks = [
    { label: 'View Courses', path: '/StudentDashboard' },
    { label: 'Enrolled Courses', path: '/EnrolledCourses' },
    { label: 'My Progress', path: '/my-progress' },
  ];

  const instructorLinks = [
    { label: 'Created Courses', path: '/instructor/courses' },
    { label: 'Update Course', path: '/instructor/update-course' },
    { label: 'Analytics Dashboard', path: '/instructor/analytics' },
  ];

  const linksToRender = user?.role === 'INSTRUCTOR' ? instructorLinks : studentLinks;

  return (
    <nav className="bg-gradient-to-r from-purple-500 to-purple-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-white text-xl font-bold">
          LearnSphere
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-white">
          {user &&
            linksToRender.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:underline transition"
              >
                {link.label}
              </Link>
            ))}
        </div>

        {/* Auth & Avatar */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-white px-4 py-2 rounded-md hover:bg-purple-600 text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-purple-700 px-4 py-2 rounded-md hover:bg-purple-100 text-sm"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="text-white px-4 py-2 rounded-md hover:bg-purple-600 text-sm"
              >
                Logout
              </button>
              <div className="w-9 h-9 rounded-full border-2 border-white bg-purple-800 flex items-center justify-center">
                {isLoading ? (
                  <span className="text-white font-bold">...</span>
                ) : (
                  <span className="text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 space-y-2 text-white px-4">
          {user &&
            linksToRender.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2 border-b"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

          {!user ? (
            <>
              <Link
                to="/login"
                className="block py-2 border-b border-purple-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block py-2 border-b border-purple-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 border-b border-purple-300"
              >
                Logout
              </button>
              <div className="w-8 h-8 rounded-full border-2 border-white  flex items-center justify-center">
                {isLoading ? (
                  <span className="text-white text-sm">...</span>
                ) : (
                  <span className="text-white text-sm">
                    {user?.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
