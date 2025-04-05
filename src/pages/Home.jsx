import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, faPlay, faClock, faChalkboardTeacher, 
  faGraduationCap, faCheckCircle, faSearch,
  faUserGraduate, faLaptopCode, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Home = () => {
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([
    { value: "10,000+", label: "Students Enrolled", icon: faUserGraduate },
    { value: "500+", label: "Expert Mentors", icon: faChalkboardTeacher },
    { value: "98%", label: "Satisfaction Rate", icon: faCheckCircle }
  ]);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await api.get("/courses", {
          params: {
            page: 1,
            limit: 6,
            featured: true,
          },
        });
        if (response.data?.data && Array.isArray(response.data.data)) {
          setFeaturedCourses(response.data.data);
        } else {
          setFeaturedCourses([]);
        }
      } catch (error) {
        setError("Failed to load featured courses");
        setFeaturedCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Animated Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-800 opacity-20 transform -skew-y-6 -rotate-6 -translate-y-24 -translate-x-10"></div>
        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Transform Your Career
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Master in-demand skills with industry-recognized courses taught by top professionals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/courses"
                className="relative overflow-hidden bg-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg group"
              >
                <span className="relative z-10">Explore Courses</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="relative overflow-hidden bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-lg font-medium hover:bg-purple-50 transition-colors shadow-lg group"
                >
                  <span className="relative z-10">Start Learning Free</span>
                  <span className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 mb-6">Trusted by leading companies</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
            <img src="https://images.unsplash.com/photo-1553895501-af9e282e7fc1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z29vZ2xlfGVufDB8fDB8fHww" alt="Google" className="h-8" />
            <img src="https://images.unsplash.com/photo-1587613842560-0816bd27a096?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1pY3Jvc29mdHxlbnwwfHwwfHx8MA%3D%3D" alt="Microsoft" className="h-8" />
            <img src="https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW1hem9ufGVufDB8fDB8fHww" alt="Amazon" className="h-8" />
            <img src="https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmV0ZmxpeHxlbnwwfHwwfHx8MA%3D%3D" alt="Netflix" className="h-8" />
            <img src="https://images.unsplash.com/photo-1589419896452-b460b8b390a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YWlyYm5ifGVufDB8fDB8fHww" alt="Airbnb" className="h-8" />
          </div>
        </div>
      </div>

      {/* Stats Section with Floating Cards */}
      <div className="container mx-auto px-4 py-16 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow transform hover:-translate-y-2"
            >
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={stat.icon} className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2 text-center">{stat.value}</h3>
              <p className="text-gray-600 text-center">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section with Icons */}
      <div className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Learn With Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best learning experience with cutting-edge technology and expert instructors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-white">
                <FontAwesomeIcon icon={faLaptopCode} className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hands-on Projects</h3>
              <p className="text-gray-600">
                Apply what you learn with real-world projects and build a portfolio that stands out.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-white">
                <FontAwesomeIcon icon={faChartLine} className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Career Growth</h3>
              <p className="text-gray-600">
                Get career guidance and job placement support to accelerate your professional journey.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-white">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Mentors</h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of practical experience in their fields.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses with Floating Effect */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600">
              Start learning with our most popular courses
            </p>
          </div>
          <Link 
            to="/courses" 
            className="mt-4 md:mt-0 flex items-center text-purple-600 hover:text-purple-800 font-medium"
          >
            View All Courses <span className="ml-2">→</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div 
                key={course._id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden group">
                  <img
                    src={course.thumbnail || "https://via.placeholder.com/400x225"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {course.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                      {course.discount}% OFF
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors flex items-center">
                      <FontAwesomeIcon icon={faPlay} className="mr-2" />
                      Preview Course
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {course.title}
                    </h3>
                    <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={course.mentor?.profilePicture || "https://via.placeholder.com/40"}
                        alt={course.mentor?.name}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">
                        {course.mentor?.name || "Instructor"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                      <span>{course.rating?.toFixed(1) || "4.5"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {course.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ${course.price}
                        </span>
                      )}
                      <span className="text-purple-600 font-bold">
                        ${(course.price * (1 - (course.discount || 0) / 100)).toFixed(2)}
                      </span>
                    </div>
                    <Link
                      to={`/courses/${course._id}`}
                      className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
                    >
                      <FontAwesomeIcon icon={faPlay} className="mr-1" />
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">No featured courses available at the moment.</p>
          </div>
        )}
      </div>

      {/* Testimonials with Gradient Background */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Hear from our students who transformed their careers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform helped me transition from marketing to a full-time UX designer role at a FAANG company.",
                name: "Sarah Johnson",
                role: "Senior UX Designer at Google",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                quote: "The courses are incredibly well-structured. I doubled my salary within 6 months of completing the program.",
                name: "Michael Chen",
                role: "Software Engineer at Microsoft",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                quote: "The mentorship program was invaluable. My mentor helped me navigate my career change seamlessly.",
                name: "Alex Rodriguez",
                role: "Data Scientist at Airbnb",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400 mr-1" />
                  ))}
                </div>
                <p className="italic text-lg mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-purple-200">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section with Floating Elements */}
      <div className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 transform -skew-y-3 -translate-y-12"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of learners and take the first step toward your dream career today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="relative overflow-hidden bg-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg group"
              >
                <span className="relative z-10">Go to Dashboard</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="relative overflow-hidden bg-purple-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg group"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Link>
                <Link
                  to="/courses"
                  className="relative overflow-hidden bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-lg font-medium hover:bg-purple-50 transition-colors shadow-lg group"
                >
                  <span className="relative z-10">Browse Courses</span>
                  <span className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-purple-600 text-white p-2 rounded-lg">
                  <FontAwesomeIcon icon={faGraduationCap} className="text-xl" />
                </div>
                <span className="text-2xl font-bold">Eduverse</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering the next generation of professionals through high-quality education.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <FontAwesomeIcon icon={faTwitter} className="text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FontAwesomeIcon icon={faDiscord} className="text-xl" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Become an Instructor</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Scholarships</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">hello@eduverse.com</li>
                <li className="text-gray-400">+1 (555) 123-4567</li>
                <li className="text-gray-400">123 Learning St, San Francisco, CA</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2023 Eduverse. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;