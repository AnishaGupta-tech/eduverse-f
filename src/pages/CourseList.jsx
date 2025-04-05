import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import courseService from "../services/courseService";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    search: "",
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses(filters);
      setCourses(response.data || []);
      setPagination({
        total: response.total || 0,
        pages: response.pages || 1,
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  // Popular categories for featured section
  const popularCategories = [
    { name: "Web Development", icon: "💻" },
    { name: "Data Science", icon: "📊" },
    { name: "Mobile Apps", icon: "📱" },
    { name: "UI/UX Design", icon: "🎨" },
    { name: "Digital Marketing", icon: "📈" },
    { name: "Cloud Computing", icon: "☁️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Expand Your Knowledge</h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8">
            Discover the perfect course to fuel your personal and professional growth
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex shadow-lg rounded-lg overflow-hidden">
              <input
                type="text"
                name="search"
                placeholder="Search for courses..."
                value={filters.search}
                onChange={handleFilterChange}
                className="flex-grow px-6 py-4 focus:outline-none text-gray-800"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 px-6 py-4 font-semibold transition duration-300"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCategories.map((category) => (
            <div
              key={category.name}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center cursor-pointer hover:bg-purple-50"
            >
              <span className="text-3xl mb-3 block">{category.icon}</span>
              <h3 className="font-medium text-gray-800">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Refine Your Search</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
            </select>
            <select
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-between items-center">
            <div className="text-center px-4 py-2">
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-purple-100">Happy Students</div>
            </div>
            <div className="text-center px-4 py-2">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-purple-100">Expert Instructors</div>
            </div>
            <div className="text-center px-4 py-2">
              <div className="text-3xl font-bold">2,000+</div>
              <div className="text-purple-100">Courses Available</div>
            </div>
            <div className="text-center px-4 py-2">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-purple-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {filters.search ? `Search Results for "${filters.search}"` : "Featured Courses"}
              </h2>
              <div className="text-purple-600 font-medium">
                {pagination.total} courses found
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    <img
                      className="absolute h-full w-full object-cover"
                      src={course.thumbnail || "https://via.placeholder.com/400x225"}
                      alt={course.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {course.level || "All Levels"}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-purple-600 font-semibold">
                        {course.category || "Uncategorized"}
                      </span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 ml-1">
                          {Math.round((Math.random() * 0.5 + 4.5) * 10) / 10} ({Math.floor(Math.random() * 100) + 10})
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-purple-700">${course.price || "Free"}</span>
                      <Link
                        to={`/courses/${course._id}`}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 font-medium"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                    disabled={filters.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-purple-50 transition duration-300"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (filters.page <= 3) {
                      pageNum = i + 1;
                    } else if (filters.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = filters.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg transition duration-300 ${
                          filters.page === pageNum
                            ? "bg-purple-600 text-white"
                            : "border border-gray-300 hover:bg-purple-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(pagination.pages, filters.page + 1))}
                    disabled={filters.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-purple-50 transition duration-300"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-r from-purple-700 to-indigo-700 p-8 md:p-12 text-white">
              <h2 className="text-2xl font-bold mb-4">Never Miss an Update</h2>
              <p className="text-purple-100 mb-6">
                Subscribe to our newsletter and get the latest course updates, discounts and learning resources
                delivered straight to your inbox.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none"
                />
                <button className="bg-purple-900 hover:bg-purple-800 px-6 py-3 font-semibold rounded-r-lg transition duration-300">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 bg-purple-50">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Subscribe?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Exclusive course discounts</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">New course announcements</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Free learning resources</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-purple-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">No spam, unsubscribe anytime</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;