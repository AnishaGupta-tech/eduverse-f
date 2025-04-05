import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  useTheme,
  alpha,
  Badge,
  IconButton,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  School,
  TrendingUp,
  EmojiEvents,
  Star,
  PlayCircle,
  CheckCircle,
  Timeline,
  Notifications,
  Bookmark,
  Share,
  FilterList,
  Person,
  Forum,
  Assignment,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import dashboardService from "../services/dashboardService";

const StatCard = ({ title, value, icon, color, subtitle, trend }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        boxShadow: "0 4px 20px rgba(123, 31, 162, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 25px rgba(123, 31, 162, 0.15)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: "50%",
              bgcolor: alpha(color, 0.1),
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 28 } })}
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h4" component="div" fontWeight="bold" color="#7b1fa2">
              {value}
            </Typography>
            {trend && (
              <Chip
                label={trend}
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: trend.includes("+") 
                    ? alpha(theme.palette.success.main, 0.2) 
                    : alpha(theme.palette.error.main, 0.2),
                  color: trend.includes("+") 
                    ? theme.palette.success.main 
                    : theme.palette.error.main,
                }}
              />
            )}
          </Box>
        </Box>
        <Typography variant="h6" color="#4a148c" gutterBottom fontWeight="medium">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const CourseCard = ({ course, type = "enrolled" }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const progress = (course.progress || 0) * 100;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        boxShadow: "0 4px 15px rgba(123, 31, 162, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 25px rgba(123, 31, 162, 0.2)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="160"
          image={
            course.thumbnail ||
            "https://source.unsplash.com/random/400x200?education"
          }
          alt={course.title}
          sx={{
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />
        {type === "recommended" && (
          <Chip
            label="New"
            color="primary"
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: theme.palette.primary.main,
              color: "white",
              fontWeight: "bold",
            }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom fontWeight="medium" color="#4a148c">
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {course.description?.length > 100
            ? `${course.description.substring(0, 100)}...`
            : course.description}
        </Typography>
        
        {type === "enrolled" && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="#7b1fa2" fontWeight="medium">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  bgcolor: theme.palette.primary.main,
                },
              }}
            />
          </Box>
        )}
        
        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            size="small"
            icon={<School sx={{ color: "#7b1fa2" }} />}
            label={course.category}
            variant="outlined"
            sx={{ borderColor: alpha(theme.palette.primary.main, 0.3) }}
          />
          <Chip
            size="small"
            icon={<PlayCircle sx={{ color: "#7b1fa2" }} />}
            label={`${course.totalModules} modules`}
            variant="outlined"
            sx={{ borderColor: alpha(theme.palette.primary.main, 0.3) }}
          />
          {course.difficulty && (
            <Chip
              size="small"
              label={course.difficulty}
              variant="outlined"
              sx={{ 
                borderColor: 
                  course.difficulty === "Beginner" ? alpha(theme.palette.success.main, 0.3) :
                  course.difficulty === "Intermediate" ? alpha(theme.palette.warning.main, 0.3) :
                  alpha(theme.palette.error.main, 0.3),
                color: 
                  course.difficulty === "Beginner" ? theme.palette.success.main :
                  course.difficulty === "Intermediate" ? theme.palette.warning.main :
                  theme.palette.error.main,
              }}
            />
          )}
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate(`/courses/${course._id}`)}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "white",
            "&:hover": {
              bgcolor: "#6a1b9a",
            },
          }}
        >
          {type === "enrolled" ? "Continue Learning" : "Enroll Now"}
        </Button>
      </Box>
    </Card>
  );
};

const NotificationItem = ({ notification }) => {
  return (
    <ListItem
      sx={{
        borderRadius: 2,
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <Notifications />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={notification.title}
        secondary={notification.message}
        primaryTypographyProps={{ fontWeight: "medium" }}
      />
    </ListItem>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();
  const theme = useTheme();

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{
          background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#7b1fa2" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
        }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 4,
        background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
      }}
    >
      {/* Header Section */}
      <Box sx={{ 
        mb: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            color="#4a148c"
          >
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Track your learning progress and discover new courses
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton sx={{ color: "#7b1fa2" }}>
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton sx={{ color: "#7b1fa2" }}>
            <Bookmark />
          </IconButton>
          <IconButton sx={{ color: "#7b1fa2" }}>
            <Share />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Enrolled Courses"
            value={dashboardData?.enrolledCourses?.length || 0}
            icon={<School />}
            color="#7b1fa2"
            subtitle="Active courses"
            trend="+2 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Courses"
            value={dashboardData?.completedCourses?.length || 0}
            icon={<CheckCircle />}
            color="#2e7d32"
            subtitle="Courses finished"
            trend="+1 this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Badges Earned"
            value={user?.badges?.length || 0}
            icon={<EmojiEvents />}
            color="#ed6c02"
            subtitle="Achievements unlocked"
            trend="+3 recently"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Learning Streak"
            value={`${dashboardData?.learningStreak || 0} days`}
            icon={<Timeline />}
            color="#0288d1"
            subtitle="Keep it up!"
            trend="+5 days"
          />
        </Grid>
      </Grid>

      {/* Main Content with Tabs */}
      <Paper 
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(123, 31, 162, 0.1)",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            bgcolor: "background.paper",
            "& .MuiTabs-indicator": {
              bgcolor: "#7b1fa2",
              height: 3,
            },
          }}
        >
          <Tab 
            label="My Courses" 
            icon={<School />} 
            iconPosition="start"
            sx={{ 
              color: activeTab === 0 ? "#7b1fa2" : "text.secondary",
              "&.Mui-selected": { color: "#7b1fa2" },
            }}
          />
          <Tab 
            label="Recommended" 
            icon={<Star />} 
            iconPosition="start"
            sx={{ 
              color: activeTab === 1 ? "#7b1fa2" : "text.secondary",
              "&.Mui-selected": { color: "#7b1fa2" },
            }}
          />
          <Tab 
            label="Community" 
            icon={<Forum />} 
            iconPosition="start"
            sx={{ 
              color: activeTab === 2 ? "#7b1fa2" : "text.secondary",
              "&.Mui-selected": { color: "#7b1fa2" },
            }}
          />
          <Tab 
            label="Assignments" 
            icon={<Assignment />} 
            iconPosition="start"
            sx={{ 
              color: activeTab === 3 ? "#7b1fa2" : "text.secondary",
              "&.Mui-selected": { color: "#7b1fa2" },
            }}
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <>
              <Box sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                mb: 3 
              }}>
                <Typography variant="h5" color="#4a148c" fontWeight="bold">
                  Continue Learning
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<FilterList />}
                  sx={{ 
                    color: "#7b1fa2",
                    borderColor: "#7b1fa2",
                  }}
                >
                  Filter
                </Button>
              </Box>
              <Grid container spacing={3}>
                {dashboardData?.enrolledCourses?.map((course) => (
                  <Grid item key={course._id} xs={12} sm={6} md={4}>
                    <CourseCard course={course} type="enrolled" />
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {activeTab === 1 && (
            <>
              <Typography variant="h5" color="#4a148c" fontWeight="bold" gutterBottom>
                Recommended For You
              </Typography>
              <Grid container spacing={3}>
                {dashboardData?.recommendedCourses?.map((course) => (
                  <Grid item key={course._id} xs={12} sm={6} md={4}>
                    <CourseCard course={course} type="recommended" />
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" color="#4a148c" fontWeight="bold" gutterBottom>
                  Recent Discussions
                </Typography>
                <Paper sx={{ p: 2, borderRadius: 3 }}>
                  <Typography color="text.secondary">
                    Community features coming soon!
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h5" color="#4a148c" fontWeight="bold" gutterBottom>
                  Top Learners
                </Typography>
                <Paper sx={{ p: 2, borderRadius: 3 }}>
                  <List>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <ListItem key={item}>
                        <ListItemAvatar>
                          <Avatar src={`https://i.pravatar.cc/150?img=${item}`} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`User ${item}`}
                          secondary={`${1000 - item*100} points`}
                        />
                        <Chip label={`#${item}`} size="small" />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h5" color="#4a148c" fontWeight="bold" gutterBottom>
                Your Assignments
              </Typography>
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Typography color="text.secondary">
                  Assignment tracking coming soon!
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Notifications and Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              boxShadow: "0 4px 15px rgba(123, 31, 162, 0.1)",
            }}
          >
            <Typography variant="h5" color="#4a148c" fontWeight="bold" gutterBottom>
              Notifications
            </Typography>
            <List>
              {[
                { title: "New Course", message: "Data Science 101 is now available" },
                { title: "Achievement", message: "You earned the 'Fast Learner' badge" },
                { title: "Reminder", message: "Complete Module 2 by Friday" },
              ].map((notification, index) => (
                <React.Fragment key={index}>
                  <NotificationItem notification={notification} />
                  {index < 2 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <Button 
              fullWidth 
              sx={{ 
                mt: 2,
                color: "#7b1fa2",
              }}
            >
              View All Notifications
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3,
              boxShadow: "0 4px 15px rgba(123, 31, 162, 0.1)",
            }}
          >
            <Typography variant="h5" color="#4a148c" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {[
                { icon: <School />, label: "Browse Courses", color: "#7b1fa2" },
                { icon: <Person />, label: "Edit Profile", color: "#0288d1" },
                { icon: <Bookmark />, label: "Saved Items", color: "#ed6c02" },
                { icon: <EmojiEvents />, label: "View Badges", color: "#2e7d32" },
              ].map((action, index) => (
                <Grid item xs={6} key={index}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={action.icon}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      borderColor: alpha(action.color, 0.3),
                      color: action.color,
                      "&:hover": {
                        borderColor: action.color,
                        bgcolor: alpha(action.color, 0.05),
                      },
                    }}
                  >
                    {action.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;