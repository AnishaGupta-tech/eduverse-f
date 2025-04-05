import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Avatar,
  Rating,
  Divider,
  IconButton
} from "@mui/material";
import {
  PlayCircleFilled,
  Bookmark,
  WorkspacePremium,
  Quiz,
  EmojiEvents,
  Star,
  AccessTime,
  School,
  People,
  CheckCircle,
  MenuBook,
  Code,
  Terminal,
  Verified,
  ArrowForward,
  FavoriteBorder,
  Share
} from "@mui/icons-material";
import courseService from "../services/courseService";
import { useAuth } from "../contexts/AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for demonstration
      const mockCourse = {
        _id: id,
        title: "Java Mastery: From Zero to Hero",
        description: "Master Java programming with this comprehensive journey from basic syntax to advanced concepts like multithreading, Spring Boot, and microservices architecture.",
        category: "Programming",
        level: "Intermediate",
        duration: 56,
        rating: 4.9,
        enrolledStudents: Array(2456).fill({}),
        mentor: {
          name: "Dr. Emily Chen",
          title: "Senior Java Architect at TechCorp",
          avatar: "https://randomuser.me/api/portraits/women/68.jpg",
          bio: "With 12+ years in Java development and education, Emily has trained over 10,000 developers. She specializes in enterprise applications and performance optimization."
        },
        modules: [
          { _id: "m1", title: "Java Fundamentals", lessons: 15, duration: 10 },
          { _id: "m2", title: "OOP Principles", lessons: 12, duration: 8 },
          { _id: "m3", title: "Collections Framework", lessons: 10, duration: 6 },
          { _id: "m4", title: "Multithreading", lessons: 8, duration: 6 },
          { _id: "m5", title: "Spring Boot", lessons: 14, duration: 12 },
          { _id: "m6", title: "Microservices", lessons: 10, duration: 8 }
        ],
        learningObjectives: [
          "Write clean, efficient Java code",
          "Design robust OOP architectures",
          "Implement multithreading solutions",
          "Build RESTful APIs with Spring Boot",
          "Create microservices applications",
          "Optimize Java application performance"
        ],
        requirements: [
          "Basic programming knowledge",
          "JDK 17+ installed",
          "IntelliJ IDEA (Community Edition works)",
          "4GB+ RAM for development"
        ],
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
      };

      try {
        const courseData = await courseService.getCourse(id);
        setCourse(courseData);
      } catch {
        setCourse(mockCourse);
      }

      if (user) {
        setProgress(Math.floor(Math.random() * 100));
      }
    } catch (err) {
      setError(err.message || "Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);
      await courseService.enrollCourse(id);
      if (course?.modules?.length > 0) {
        navigate(`/courses/${id}/modules/${course.modules[0]._id}`);
      } else {
        navigate(`/courses/${id}`);
      }
    } catch (err) {
      setError(err.message || "Failed to enroll in course");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress size={80} thickness={4} sx={{ color: "purple.500" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: "md", mx: "auto", p: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate("/courses")}
          sx={{ 
            bgcolor: "purple.700", 
            "&:hover": { bgcolor: "purple.800" },
            px: 4,
            py: 1.5
          }}
        >
          Back to Courses
        </Button>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ maxWidth: "md", mx: "auto", p: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Course not found
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate("/courses")}
          sx={{ 
            bgcolor: "purple.700", 
            "&:hover": { bgcolor: "purple.800" },
            px: 4,
            py: 1.5
          }}
        >
          Back to Courses
        </Button>
      </Box>
    );
  }

  const isEnrolled = course.enrolledStudents?.some(
    (student) => student._id === user?._id || student === user?._id
  );

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box sx={{
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${course.thumbnail})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        py: { xs: 6, md: 10 },
        px: 3,
        position: "relative"
      }}>
        <Box sx={{ 
          maxWidth: "xl",
          mx: "auto",
          position: "relative",
          zIndex: 1
        }}>
          <Box sx={{ 
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4
          }}>
            <Chip
              label={course.category}
              sx={{ 
                bgcolor: "purple.600",
                color: "white",
                fontWeight: 600,
                px: 2,
                py: 1
              }}
              icon={<Code sx={{ color: "white" }} />}
            />
            <Box>
              <IconButton onClick={() => setIsFavorite(!isFavorite)} sx={{ color: isFavorite ? "red" : "white" }}>
                <FavoriteBorder />
              </IconButton>
              <IconButton sx={{ color: "white" }}>
                <Share />
              </IconButton>
            </Box>
          </Box>

          <Typography variant="h1" sx={{ 
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            lineHeight: 1.2,
            maxWidth: "800px"
          }}>
            {course.title}
          </Typography>
          
          <Typography variant="h5" sx={{ 
            mb: 4,
            fontSize: { xs: "1.1rem", md: "1.3rem" },
            maxWidth: "700px",
            opacity: 0.9
          }}>
            {course.description}
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
            <Chip
              icon={<School sx={{ color: "white" }} />}
              label={course.level}
              sx={{ 
                bgcolor: "rgba(255,255,255,0.15)", 
                color: "white",
                px: 1.5
              }}
            />
            <Chip
              icon={<AccessTime sx={{ color: "white" }} />}
              label={`${course.duration} hours`}
              sx={{ 
                bgcolor: "rgba(255,255,255,0.15)", 
                color: "white",
                px: 1.5
              }}
            />
            <Chip
              icon={<People sx={{ color: "white" }} />}
              label={`${course.enrolledStudents?.length || 2456} students`}
              sx={{ 
                bgcolor: "rgba(255,255,255,0.15)", 
                color: "white",
                px: 1.5
              }}
            />
            <Chip
              icon={<Star sx={{ color: "white" }} />}
              label={`${course.rating} rating`}
              sx={{ 
                bgcolor: "rgba(255,255,255,0.15)", 
                color: "white",
                px: 1.5
              }}
            />
          </Box>

          {isEnrolled && (
            <Box sx={{ maxWidth: "600px", mb: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Your Progress
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {Math.round(progress)}% Complete
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "purple.500",
                    borderRadius: 5
                  },
                  bgcolor: "rgba(255,255,255,0.2)"
                }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={isEnrolled ? 
              () => navigate(`/courses/${id}/modules/${course.modules[0]._id}`) : 
              handleEnroll
            }
            disabled={loading}
            sx={{
              bgcolor: "purple.600",
              "&:hover": { bgcolor: "purple.700" },
              px: 6,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: "0 8px 20px rgba(103, 58, 183, 0.5)",
              textTransform: "none"
            }}
          >
            {isEnrolled ? "Continue Learning" : "Enroll Now"}
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        maxWidth: "xl", 
        mx: "auto", 
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 8 },
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: 6
      }}>
        {/* Left Column */}
        <Box sx={{ flex: 1 }}>
          {/* Course Highlights */}
          <Box sx={{ 
            bgcolor: "background.paper",
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            mb: 5,
            boxShadow: "0 10px 30px rgba(103, 58, 183, 0.1)"
          }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              mb: 4,
              color: "purple.800",
              display: "flex",
              alignItems: "center",
              gap: 2
            }}>
              <EmojiEvents sx={{ fontSize: "2.5rem" }} /> What You'll Achieve
            </Typography>
            
            <Box sx={{ 
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3
            }}>
              {course.learningObjectives?.map((objective, i) => (
                <Box key={i} sx={{ 
                  display: "flex", 
                  alignItems: "flex-start",
                  p: 3,
                  bgcolor: "purple.50",
                  borderRadius: 2,
                  borderLeft: "4px solid",
                  borderColor: "purple.500"
                }}>
                  <CheckCircle sx={{ 
                    color: "purple.700", 
                    mr: 2, 
                    mt: 0.5,
                    fontSize: "1.5rem"
                  }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {objective}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Course Curriculum */}
          <Box sx={{ 
            bgcolor: "background.paper",
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            mb: 5,
            boxShadow: "0 10px 30px rgba(103, 58, 183, 0.1)"
          }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              mb: 4,
              color: "purple.800",
              display: "flex",
              alignItems: "center",
              gap: 2
            }}>
              <MenuBook sx={{ fontSize: "2.5rem" }} /> Course Curriculum
            </Typography>
            
            <Box sx={{ 
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden"
            }}>
              {course.modules?.map((module, index) => (
                <Box key={module._id}>
                  <Box 
                    sx={{ 
                      p: { xs: 2, md: 3 },
                      bgcolor: index % 2 === 0 ? "background.paper" : "grey.50",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "purple.50"
                      }
                    }}
                    onClick={() => navigate(`/courses/${id}/modules/${module._id}`)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PlayCircleFilled sx={{ 
                        color: "purple.700", 
                        mr: 2,
                        fontSize: "2rem"
                      }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {module.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {module.lessons} lessons • {module.duration} hours
                        </Typography>
                      </Box>
                    </Box>
                    <ArrowForward sx={{ color: "purple.700" }} />
                  </Box>
                  {index < course.modules.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Testimonials */}
          <Box sx={{ 
            bgcolor: "background.paper",
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            boxShadow: "0 10px 30px rgba(103, 58, 183, 0.1)"
          }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              mb: 4,
              color: "purple.800"
            }}>
              Student Success Stories
            </Typography>
            
            <Box sx={{ 
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4
            }}>
              <Box sx={{ 
                p: 4,
                bgcolor: "purple.50",
                borderRadius: 3,
                borderTop: "4px solid",
                borderColor: "purple.500",
                position: "relative"
              }}>
                <Verified sx={{ 
                  position: "absolute",
                  top: -16,
                  right: 16,
                  fontSize: "3rem",
                  color: "purple.500"
                }} />
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    sx={{ 
                      width: 60, 
                      height: 60,
                      mr: 2,
                      border: "2px solid",
                      borderColor: "purple.300"
                    }} 
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Michael R.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Java Developer at Amazon
                    </Typography>
                  </Box>
                </Box>
                <Rating value={5} readOnly sx={{ color: "purple.700", mb: 2 }} />
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  "This course completely transformed my career. The Spring Boot section alone was worth the price!"
                </Typography>
              </Box>

              <Box sx={{ 
                p: 4,
                bgcolor: "purple.50",
                borderRadius: 3,
                borderTop: "4px solid",
                borderColor: "purple.500"
              }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    sx={{ 
                      width: 60, 
                      height: 60,
                      mr: 2,
                      border: "2px solid",
                      borderColor: "purple.300"
                    }} 
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Sarah K.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Backend Engineer at Spotify
                    </Typography>
                  </Box>
                </Box>
                <Rating value={5} readOnly sx={{ color: "purple.700", mb: 2 }} />
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  "Emily's teaching style made complex concepts easy to understand. I went from beginner to job-ready in 3 months."
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Column */}
        <Box sx={{ width: { xs: "100%", lg: "400px" } }}>
          {/* Instructor Card */}
          <Box sx={{ 
            bgcolor: "background.paper",
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            mb: 5,
            boxShadow: "0 10px 30px rgba(103, 58, 183, 0.1)",
            borderTop: "4px solid",
            borderColor: "purple.500"
          }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              mb: 3,
              color: "purple.800"
            }}>
              Your Instructor
            </Typography>
            
            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Avatar 
                src={course.mentor?.avatar} 
                sx={{ 
                  width: 100, 
                  height: 100,
                  border: "3px solid",
                  borderColor: "purple.300"
                }} 
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {course.mentor?.name}
                </Typography>
                <Typography variant="body1" sx={{ color: "purple.700", mb: 1.5 }}>
                  {course.mentor?.title}
                </Typography>
                <Rating 
                  value={5} 
                  readOnly 
                  sx={{ color: "purple.700" }} 
                />
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              {course.mentor?.bio}
            </Typography>
            
            <Box sx={{ 
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mb: 3
            }}>
              <Box sx={{ 
                p: 2,
                bgcolor: "purple.50",
                borderRadius: 2,
                textAlign: "center"
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "purple.800" }}>
                  12+
                </Typography>
                <Typography variant="body2">
                  Years Experience
                </Typography>
              </Box>
              <Box sx={{ 
                p: 2,
                bgcolor: "purple.50",
                borderRadius: 2,
                textAlign: "center"
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "purple.800" }}>
                  10K+
                </Typography>
                <Typography variant="body2">
                  Students Taught
                </Typography>
              </Box>
              <Box sx={{ 
                p: 2,
                bgcolor: "purple.50",
                borderRadius: 2,
                textAlign: "center"
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "purple.800" }}>
                  4.9
                </Typography>
                <Typography variant="body2">
                  Average Rating
                </Typography>
              </Box>
              <Box sx={{ 
                p: 2,
                bgcolor: "purple.50",
                borderRadius: 2,
                textAlign: "center"
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "purple.800" }}>
                  15
                </Typography>
                <Typography variant="body2">
                  Courses Created
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Course Features */}
          <Box sx={{ 
            bgcolor: "background.paper",
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            mb: 5,
            boxShadow: "0 10px 30px rgba(103, 58, 183, 0.1)"
          }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              mb: 3,
              color: "purple.800"
            }}>
              Course Features
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <WorkspacePremium sx={{ 
                  color: "purple.700", 
                  mr: 2,
                  fontSize: "2rem"
                }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Certificate of Completion
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Earn a verifiable certificate upon finishing
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AccessTime sx={{ 
                  color: "purple.700", 
                  mr: 2,
                  fontSize: "2rem"
                }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Lifetime Access
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Learn at your own pace forever
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Terminal sx={{ 
                  color: "purple.700", 
                  mr: 2,
                  fontSize: "2rem"
                }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Hands-on Projects
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Build real-world applications
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Quiz sx={{ 
                  color: "purple.700", 
                  mr: 2,
                  fontSize: "2rem"
                }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Coding Exercises
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Practice with interactive challenges
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Requirements */}
          <Box sx={{ 
            bgcolor: "background.paper",
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            boxShadow: "0 10px 30px rgba(103, 58, 183, 0.1)"
          }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              mb: 3,
              color: "purple.800"
            }}>
              Requirements
            </Typography>
            
            <Box component="ul" sx={{ pl: 2 }}>
              {course.requirements?.map((req, i) => (
                <Box 
                  component="li" 
                  key={i} 
                  sx={{ 
                    mb: 2,
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <CheckCircle sx={{ 
                    color: "purple.700", 
                    mr: 1.5,
                    fontSize: "1.2rem"
                  }} />
                  <Typography>{req}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Call to Action */}
      <Box sx={{ 
        bgcolor: "purple.900",
        color: "white",
        py: { xs: 6, md: 10 },
        px: 3,
        textAlign: "center"
      }}>
        <Typography variant="h2" sx={{ 
          fontWeight: 800,
          mb: 3,
          fontSize: { xs: "2rem", md: "2.5rem" }
        }}>
          Ready to Master Java?
        </Typography>
        
        <Typography variant="h5" sx={{ 
          mb: 5,
          fontSize: { xs: "1.1rem", md: "1.3rem" },
          maxWidth: "700px",
          mx: "auto",
          opacity: 0.9
        }}>
          Join {course.enrolledStudents?.length || 2456}+ students in this comprehensive Java journey
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          onClick={isEnrolled ? 
            () => navigate(`/courses/${id}/modules/${course.modules[0]._id}`) : 
            handleEnroll
          }
          disabled={loading}
          sx={{
            bgcolor: "white",
            color: "purple.900",
            "&:hover": { bgcolor: "grey.100" },
            px: 6,
            py: 2,
            fontSize: "1.1rem",
            fontWeight: 700,
            borderRadius: 2,
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
            textTransform: "none"
          }}
        >
          {isEnrolled ? "Continue Learning" : "Enroll Now"}
        </Button>
      </Box>
    </Box>
  );
};

export default CourseDetail;