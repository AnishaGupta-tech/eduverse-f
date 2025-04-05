import React, { useState, useEffect } from "react";
import { getMentors } from "../api/mentor";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, faGraduationCap, faChalkboardUser, 
  faMedal, faSearch, faFilter, faUserTie
} from '@fortawesome/free-solid-svg-icons';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [sortBy, setSortBy] = useState("points");

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await getMentors();
        setMentors(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors
    .filter(mentor => 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.skills.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter(mentor => 
      filterLevel === "all" || mentor.level === filterLevel
    )
    .sort((a, b) => {
      if (sortBy === "points") return b.points - a.points;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 flex justify-center items-center">
            <FontAwesomeIcon icon={faUserTie} className="mr-4" />
            Meet Our Expert Mentors
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Learn from industry professionals with real-world experience and personalized guidance.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-8 -mt-12">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search mentors or skills..."
                className="pl-10 w-full py-2 px-4 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFilter} className="text-purple-500 mr-2" />
                <select
                  className="border border-purple-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex items-center">
                <FontAwesomeIcon icon={faStar} className="text-purple-500 mr-2" />
                <select
                  className="border border-purple-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="points">Sort by Points</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
              <div 
                key={mentor._id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center">
                    <img
                      src={mentor.profilePicture || "https://via.placeholder.com/200x200?text=No+Image"}
                      alt={mentor.name}
                      className="w-32 h-32 rounded-full border-4 border-white object-cover"
                    />
                  </div>
                  {mentor.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <FontAwesomeIcon icon={faStar} className="mr-1" />
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                  <p className="text-purple-600 font-medium mb-3">{mentor.title || "Professional Mentor"}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mentor.bio || "Experienced mentor with industry knowledge"}</p>

                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {mentor.skills.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.skills.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{mentor.skills.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-around mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center text-purple-600 mb-1">
                        <FontAwesomeIcon icon={faGraduationCap} className="mr-1" />
                        <span className="text-xs font-medium">LEVEL</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        mentor.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        mentor.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {mentor.level}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center text-purple-600 mb-1">
                        <FontAwesomeIcon icon={faMedal} className="mr-1" />
                        <span className="text-xs font-medium">POINTS</span>
                      </div>
                      <span className="text-gray-900 font-bold">{mentor.points}</span>
                    </div>
                  </div>

                  <Link to={`/mentors/${mentor._id}`}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl mx-auto">
                <FontAwesomeIcon icon={faSearch} className="text-4xl text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No mentors found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <Button 
                  variant="outline" 
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterLevel("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        {filteredMentors.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-800 mb-2">{mentors.length}</div>
                <div className="text-gray-600">Total Mentors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-800 mb-2">
                  {mentors.filter(m => m.level === 'advanced').length}
                </div>
                <div className="text-gray-600">Advanced</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-800 mb-2">
                  {mentors.filter(m => m.featured).length}
                </div>
                <div className="text-gray-600">Featured</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-800 mb-2">
                  {Math.max(...mentors.map(m => m.points), 0)}
                </div>
                <div className="text-gray-600">Highest Points</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentors;