import { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import { useCourse } from '../Context/CourseContext';
import { Search, ChevronDown } from 'lucide-react';
import React from 'react';

const StudentDashboard = () => {
  const { fetchPublishedCourses } = useCourse();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Categories');
  const [categories, setCategories] = useState(['Categories']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPublishedCourses();
        setCourses(data);
        setFilteredCourses(data);

        const uniqueCategories = ['Categories', ...Array.from(new Set(
          data.map((course) => course.category?.toLowerCase().trim()).filter(Boolean)
        ))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [fetchPublishedCourses]);

  useEffect(() => {
    if (!courses.length) return;

    let filtered = [...courses];

    if (selectedCategory && selectedCategory !== 'Categories') {
      filtered = filtered.filter(
        (course) =>
          (course.category?.toLowerCase().trim() || '') ===
          selectedCategory.toLowerCase().trim()
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();

      const startsWithTitle = [];
      const includesInTitle = [];
      const includesInDescription = [];

      courses.forEach((course) => {
        const title = course.title?.toLowerCase().trim() || '';
        const description = course.description?.toLowerCase().trim() || '';

        if (title.startsWith(term)) {
          startsWithTitle.push(course);
        } else if (title.includes(term)) {
          includesInTitle.push(course);
        } else if (description.includes(term)) {
          includesInDescription.push(course);
        }
      });

      filtered = [
        ...startsWithTitle,
        ...includesInTitle,
        ...includesInDescription,
      ];
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory, courses]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const formatCategoryLabel = (category) =>
    category.charAt(0).toUpperCase() + category.slice(1);

  if (loading) return <div className="text-center mt-8 font-sans">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500 font-sans">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-800 mb-8 text-center flex items-center justify-center gap-2">
        All Courses
      </h1>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative w-full lg:w-2/3">
          <span className="absolute inset-y-0 left-3 flex items-center text-purple-900">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full lg:w-1/3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none px-4 py-2 border border-gray-300 rounded-lg w-full bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {formatCategoryLabel(category)}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No courses found{searchTerm ? ` for "${searchTerm}"` : ''}.
          </div>
        ) : (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
