import React, { useState, useEffect } from "react";
import { 
  faTachometerAlt, faInbox, faBook, faTasks, faUsers, 
  faCog, faSignOutAlt, faBell, faEnvelope, faPlay, faEllipsisH,
  faGraduationCap, faChartLine, faTrophy, faFire, faShare, 
  faCheckCircle, faStar, faFilter, faUser // Add faUser here
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import dashboardService from "../services/dashboardService";
import { LinearProgress, Avatar, Chip, Badge, Divider } from "@mui/material";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FaShare } from 'react-icons/fa';




const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-white shadow-md p-4 hidden md:block">
      <div className="flex items-center justify-center mb-8 mt-4">
        <h1 className="text-xl font-bold text-purple-800">LearnHub</h1>
      </div>
      <ul className="space-y-2">
        <SidebarItem 
          icon={faTachometerAlt} 
          text="Dashboard" 
          active 
          onClick={() => navigate('/dashboard')}
        />
        <SidebarItem 
          icon={faBook} 
          text="My Courses" 
          onClick={() => navigate('/my-courses')}
        />
        <SidebarItem 
          icon={faTasks} 
          text="Assignments" 
          onClick={() => navigate('/assignments')}
        />
        <SidebarItem 
          icon={faUsers} 
          text="Community" 
          onClick={() => navigate('/community')}
        />
        <SidebarItem 
          icon={faInbox} 
          text="Messages" 
          onClick={() => navigate('/messages')}
        />
        <SidebarItem 
          icon={faCog} 
          text="Settings" 
          onClick={() => navigate('/settings')}
        />
        <div className="border-t border-gray-200 my-4"></div>
        <SidebarItem 
          icon={faSignOutAlt} 
          text="Logout" 
          logout 
          onClick={logout}
        />
      </ul>
    </div>
  );
};

const SidebarItem = ({ icon, text, active = false, logout = false, onClick }) => {
  return (
    <li 
      className={`p-3 rounded-lg flex items-center ${active ? 'bg-purple-100 text-purple-600' : ''} ${logout ? 'text-red-600 hover:bg-red-50' : 'hover:bg-gray-100'} cursor-pointer transition-colors`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className="mr-3 w-4" />
      <span className="font-medium">{text}</span>
    </li>
  );
};

const StatsCard = ({ title, value, icon, color, trend }) => {
  const trendColor = trend?.includes("+") ? "text-green-500" : "text-red-500";
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all h-full">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-full ${color} bg-opacity-10`}>
          <FontAwesomeIcon icon={icon} className={`text-lg ${color}`} />
        </div>
        {trend && (
          <span className={`text-xs ${trendColor} font-medium`}>{trend}</span>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500 mt-1">{title}</div>
      </div>
    </div>
  );
};

const CourseCard = ({ course, type = "enrolled", onClick }) => {
  const progress = (course.progress || 0) * 100;
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all h-full flex flex-col"
      onClick={() => onClick ? onClick() : navigate(`/courses/${course._id}`)}
    >
      <div className="relative">
        <img
          src={course.thumbnail || "https://source.unsplash.com/random/400x200?education"}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
        {type === "recommended" && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
            New
          </div>
        )}
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {course.description?.length > 100
            ? `${course.description.substring(0, 100)}...`
            : course.description}
        </p>
        
        {type === "enrolled" && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Progress</span>
              <span className="text-purple-600 font-medium">{Math.round(progress)}%</span>
            </div>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(123, 31, 162, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: '#7b1fa2',
                },
              }}
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Chip 
            label={course.category} 
            size="small" 
            variant="outlined" 
            className="border-purple-200 text-purple-600"
          />
          <Chip 
            label={`${course.totalModules} modules`} 
            size="small" 
            variant="outlined" 
            className="border-purple-200 text-purple-600"
          />
          {course.difficulty && (
            <Chip
              label={course.difficulty}
              size="small"
              variant="outlined"
              className={
                course.difficulty === "Beginner" ? "border-green-200 text-green-600" :
                course.difficulty === "Intermediate" ? "border-yellow-200 text-yellow-600" :
                "border-red-200 text-red-600"
              }
            />
          )}
        </div>
      </div>
      <div className="px-4 pb-4">
        <button 
          className={`w-full py-2 rounded-lg font-medium ${type === "enrolled" ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-white border border-purple-600 text-purple-600 hover:bg-purple-50'} transition-colors`}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/courses/${course._id}`);
          }}
        >
          {type === "enrolled" ? "Continue Learning" : "Enroll Now"}
        </button>
      </div>
    </div>
  );
};

const NotificationItem = ({ notification }) => {
  return (
    <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
      <div className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3">
        <FontAwesomeIcon icon={faBell} className="w-4" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{notification.title}</h4>
        <p className="text-sm text-gray-500">{notification.message}</p>
      </div>
      <span className="text-xs text-gray-400 ml-2">2h ago</span>
    </div>
  );
};

const QuickActionItem = ({ icon, label, color }) => {
  return (
    <button className={`flex flex-col items-center justify-center p-4 rounded-lg border ${color.border} ${color.text} hover:bg-gray-50 transition-colors`}>
      <div className={`p-3 rounded-full ${color.bg} mb-2`}>
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 font-bold mb-2">Error</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back, {user?.name}!</h1>
            <p className="text-gray-500">Track your learning progress and discover new courses</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={faBell} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">4</span>
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={faBookmark} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <FontAwesomeIcon icon={faShare} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            title="Enrolled Courses" 
            value={dashboardData?.enrolledCourses?.length || 0} 
            icon={faGraduationCap} 
            color="text-purple-600" 
            trend="+2 this month"
          />
          <StatsCard 
            title="Completed Courses" 
            value={dashboardData?.completedCourses?.length || 0} 
            icon={faCheckCircle} 
            color="text-green-600" 
            trend="+1 this week"
          />
          <StatsCard 
            title="Badges Earned" 
            value={user?.badges?.length || 0} 
            icon={faTrophy} 
            color="text-yellow-600" 
            trend="+3 recently"
          />
          <StatsCard 
            title="Learning Streak" 
            value={`${dashboardData?.learningStreak || 0} days`} 
            icon={faFire} 
            color="text-orange-600" 
            trend="+5 days"
          />
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => handleTabChange(0)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center space-x-2 ${activeTab === 0 ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FontAwesomeIcon icon={faBook} />
                <span>My Courses</span>
              </button>
              <button
                onClick={() => handleTabChange(1)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center space-x-2 ${activeTab === 1 ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FontAwesomeIcon icon={faStar} />
                <span>Recommended</span>
              </button>
              <button
                onClick={() => handleTabChange(2)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center space-x-2 ${activeTab === 2 ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FontAwesomeIcon icon={faUsers} />
                <span>Community</span>
              </button>
              <button
                onClick={() => handleTabChange(3)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center space-x-2 ${activeTab === 3 ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FontAwesomeIcon icon={faTasks} />
                <span>Assignments</span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 0 && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Continue Learning</h2>
                  <button className="flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium">
                    <FontAwesomeIcon icon={faFilter} className="mr-2" />
                    Filter
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData?.enrolledCourses?.map((course) => (
                    <CourseCard 
                      key={course._id} 
                      course={course} 
                      type="enrolled" 
                    />
                  ))}
                </div>
              </>
            )}

            {activeTab === 1 && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Recommended For You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData?.recommendedCourses?.map((course) => (
                    <CourseCard 
                      key={course._id} 
                      course={course} 
                      type="recommended" 
                    />
                  ))}
                </div>
              </>
            )}

            {activeTab === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Discussions</h2>
                  <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                    Community features coming soon!
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Top Learners</h2>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-center py-3">
                        <Avatar 
                          src={`https://i.pravatar.cc/150?img=${item}`} 
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">User {item}</h4>
                          <p className="text-sm text-gray-500">{1000 - item*100} points</p>
                        </div>
                        <span className="text-sm font-medium text-gray-500">#{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Your Assignments</h2>
                <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                  Assignment tracking coming soon!
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Section - Notifications and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
            <div className="space-y-2">
              {[
                { title: "New Course", message: "Data Science 101 is now available" },
                { title: "Achievement", message: "You earned the 'Fast Learner' badge" },
                { title: "Reminder", message: "Complete Module 2 by Friday" },
              ].map((notification, index) => (
                <React.Fragment key={index}>
                  <NotificationItem notification={notification} />
                  {index < 2 && <Divider />}
                </React.Fragment>
              ))}
            </div>
            <button className="w-full mt-4 text-purple-600 hover:text-purple-800 text-sm font-medium">
              View All Notifications
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionItem 
                icon={faBook} 
                label="Browse Courses" 
                color={{ bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" }}
              />
              <QuickActionItem 
                icon={faUser} 
                label="Edit Profile" 
                color={{ bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" }}
              />
              <QuickActionItem 
                icon={faBookmark} 
                label="Saved Items" 
                color={{ bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" }}
              />
              <QuickActionItem 
                icon={faTrophy} 
                label="View Badges" 
                color={{ bg: "bg-green-100", text: "text-green-600", border: "border-green-200" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;