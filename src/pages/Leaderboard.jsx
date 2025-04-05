import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Divider,
  LinearProgress,
  Button,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  Star as StarIcon,
  School as SchoolIcon,
  FilterList as FilterIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import gamificationService from "../services/gamificationService";
import { useAuth } from "../contexts/AuthContext";

const Leaderboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("all");
  const [userRank, setUserRank] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    roles: ["Student", "Instructor", "Admin"],
    selectedRoles: [],
  });

  useEffect(() => {
    fetchLeaderboardData();
  }, [period, filterOptions.selectedRoles]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gamificationService.getLeaderboard(period);

      // Ensure data is an array
      let leaderboardArray = Array.isArray(data)
        ? data
        : data.leaderboard || data.data || [];

      // Apply role filters if any
      if (filterOptions.selectedRoles.length > 0) {
        leaderboardArray = leaderboardArray.filter((item) =>
          filterOptions.selectedRoles.includes(item.role || "Student")
        );
      }

      setLeaderboardData(leaderboardArray);

      // Find user's rank
      if (user && leaderboardArray.length > 0) {
        const userIndex = leaderboardArray.findIndex(
          (item) => item.userId === user._id || item._id === user._id
        );
        if (userIndex !== -1) {
          setUserRank({
            rank: userIndex + 1,
            ...leaderboardArray[userIndex],
          });
        }
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (event, newValue) => {
    setPeriod(newValue);
  };

  const handleRoleFilterChange = (role) => {
    setFilterOptions((prev) => {
      const newSelectedRoles = prev.selectedRoles.includes(role)
        ? prev.selectedRoles.filter((r) => r !== role)
        : [...prev.selectedRoles, role];
      
      return {
        ...prev,
        selectedRoles: newSelectedRoles,
      };
    });
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "#FFD700"; // Gold
    if (rank === 2) return "#C0C0C0"; // Silver
    if (rank === 3) return "#CD7F32"; // Bronze
    return theme.palette.mode === "dark" ? "#9c27b0" : "#7b1fa2";
  };

  const formatPoints = (points) => {
    return points?.toLocaleString() || "0";
  };

  const calculateProgress = (userPoints) => {
    if (!leaderboardData.length) return 0;
    const maxPoints = Math.max(...leaderboardData.map(item => item.points || item.score || 0));
    return (userPoints / maxPoints) * 100;
  };

  const shareLeaderboard = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out the learning leaderboard!",
        text: `I'm ranked #${userRank?.rank || '--'} on the leaderboard with ${userRank?.points || 0} points. Can you beat me?`,
        url: window.location.href,
      }).catch(() => {
        // Fallback for when share is cancelled
        console.log('Sharing was cancelled');
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      alert(`Share this leaderboard! Current URL: ${window.location.href}`);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#7b1fa2" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ background: "#f3e5f5" }}>
        <Alert severity="error" sx={{ mt: 2 }}>
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
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(123, 31, 162, 0.15)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            color: "#4a148c",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Learning Leaderboard
        </Typography>
        <Box>
          <Tooltip title="Share leaderboard">
            <IconButton onClick={shareLeaderboard} sx={{ color: "#7b1fa2" }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter options">
            <IconButton 
              onClick={() => setShowFilters(!showFilters)} 
              sx={{ color: "#7b1fa2" }}
            >
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {showFilters && (
        <Paper sx={{ p: 2, mb: 3, background: "#f3e5f5" }}>
          <Typography variant="subtitle1" sx={{ mb: 1, color: "#4a148c" }}>
            Filter by Role
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {filterOptions.roles.map((role) => (
              <Chip
                key={role}
                label={role}
                clickable
                color={
                  filterOptions.selectedRoles.includes(role) 
                    ? "primary" 
                    : "default"
                }
                onClick={() => handleRoleFilterChange(role)}
                variant={
                  filterOptions.selectedRoles.includes(role) 
                    ? "filled" 
                    : "outlined"
                }
                sx={{
                  borderColor: "#7b1fa2",
                  color: filterOptions.selectedRoles.includes(role) 
                    ? "white" 
                    : "#7b1fa2",
                }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* User's rank card */}
      {userRank && (
        <Card
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #6a1b9a 100%)`,
            color: "white",
            boxShadow: "0 4px 20px rgba(123, 31, 162, 0.3)",
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: getRankColor(userRank.rank),
            },
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <Typography variant="h2" component="div">
                  #{userRank.rank}
                </Typography>
                <Typography variant="subtitle1">Your Rank</Typography>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <Typography variant="h4" component="div">
                  {formatPoints(userRank.points || userRank.score || 0)}
                </Typography>
                <Typography variant="subtitle1">Your Points</Typography>
                <LinearProgress
                  variant="determinate"
                  value={calculateProgress(userRank.points || userRank.score || 0)}
                  sx={{
                    mt: 1,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: getRankColor(userRank.rank),
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <Badge 
                    badgeContent={userRank.badges?.length || 0} 
                    color="secondary"
                    sx={{ "& .MuiBadge-badge": { right: -5, top: -5 } }}
                  >
                    <StarIcon fontSize="large" />
                  </Badge>
                  <Badge 
                    badgeContent={userRank.completedCourses?.length || 0} 
                    color="secondary"
                    sx={{ "& .MuiBadge-badge": { right: -5, top: -5 } }}
                  >
                    <SchoolIcon fontSize="large" />
                  </Badge>
                </Box>
                <Typography variant="subtitle1">Achievements</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Period selector */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: "divider", 
        mb: 3,
        "& .MuiTabs-indicator": {
          backgroundColor: "#9c27b0",
          height: 3,
        },
      }}>
        <Tabs
          value={period}
          onChange={handlePeriodChange}
          aria-label="leaderboard period tabs"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
        >
          <Tab 
            label="All Time" 
            value="all" 
            sx={{ 
              color: period === "all" ? "#9c27b0" : "inherit",
              "&.Mui-selected": { color: "#9c27b0" },
            }} 
          />
          <Tab 
            label="This Month" 
            value="month" 
            sx={{ 
              color: period === "month" ? "#9c27b0" : "inherit",
              "&.Mui-selected": { color: "#9c27b0" },
            }} 
          />
          <Tab 
            label="This Week" 
            value="week" 
            sx={{ 
              color: period === "week" ? "#9c27b0" : "inherit",
              "&.Mui-selected": { color: "#9c27b0" },
            }} 
          />
        </Tabs>
      </Box>

      {/* Leaderboard table */}
      {leaderboardData.length > 0 ? (
        <TableContainer 
          component={Paper} 
          elevation={2}
          sx={{ 
            borderRadius: 2,
            border: "1px solid rgba(123, 31, 162, 0.2)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)" }}>
                <TableCell sx={{ color: "white" }}>Rank</TableCell>
                <TableCell sx={{ color: "white" }}>User</TableCell>
                <TableCell align="right" sx={{ color: "white" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    Points
                    <Tooltip title="Points are earned by completing courses, lessons, and challenges">
                      <InfoIcon sx={{ ml: 0.5, fontSize: "1rem" }} />
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: "white" }}>Badges</TableCell>
                <TableCell align="right" sx={{ color: "white" }}>Completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardData.map((item, index) => (
                <TableRow
                  key={item._id || item.userId || index}
                  sx={{
                    backgroundColor:
                      user &&
                      (item.userId === user._id || item._id === user._id)
                        ? "rgba(156, 39, 176, 0.08)"
                        : "inherit",
                    "&:hover": {
                      backgroundColor: "rgba(156, 39, 176, 0.05)",
                    },
                    "&:nth-of-type(odd)": {
                      backgroundColor: 
                        user &&
                        (item.userId === user._id || item._id === user._id)
                          ? "rgba(156, 39, 176, 0.12)"
                          : "rgba(156, 39, 176, 0.03)",
                      "&:hover": {
                        backgroundColor: "rgba(156, 39, 176, 0.08)",
                      },
                    },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: getRankColor(index + 1),
                      }}
                    >
                      {index < 3 ? (
                        <TrophyIcon sx={{ mr: 1 }} />
                      ) : (
                        <Typography variant="body1" fontWeight={index < 10 ? "bold" : "normal"}>
                          #{index + 1}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={item.avatar || item.profilePicture}
                        alt={item.name || "User"}
                        sx={{ 
                          mr: 2,
                          border: "2px solid #9c27b0",
                          width: 40,
                          height: 40,
                        }}
                      >
                        {(item.name || "U")[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {item.name || "Anonymous User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.role || "Student"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="bold" color="#7b1fa2">
                      {formatPoints(item.points || item.score || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={item.badges?.length || 0}
                      color="primary"
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderColor: "#9c27b0",
                        color: "#7b1fa2",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={item.completedCourses?.length || 0}
                      color="secondary"
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderColor: "#9c27b0",
                        color: "#7b1fa2",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper 
          sx={{ 
            p: 3, 
            textAlign: "center",
            background: "rgba(156, 39, 176, 0.05)",
            border: "1px dashed #9c27b0",
          }}
        >
          <Typography variant="h6" color="#7b1fa2">
            No leaderboard data available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {filterOptions.selectedRoles.length > 0
              ? "Try adjusting your filters"
              : "Check back later to see the rankings"}
          </Typography>
          {filterOptions.selectedRoles.length > 0 && (
            <Button 
              variant="outlined" 
              sx={{ mt: 2, color: "#7b1fa2", borderColor: "#7b1fa2" }}
              onClick={() => setFilterOptions(prev => ({ ...prev, selectedRoles: [] }))}
            >
              Clear Filters
            </Button>
          )}
        </Paper>
      )}

      {/* Stats cards */}
      <Box sx={{ mt: 4 }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            color: "#4a148c",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TimelineIcon color="primary" />
          Leaderboard Insights
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
              border: "1px solid rgba(123, 31, 162, 0.2)",
            }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <PersonIcon
                    sx={{ 
                      fontSize: 40, 
                      color: "#9c27b0", 
                      mb: 1,
                      p: 1,
                      bgcolor: "rgba(156, 39, 176, 0.1)",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography variant="h4" component="div" color="#7b1fa2">
                    {leaderboardData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Participants
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
              border: "1px solid rgba(123, 31, 162, 0.2)",
            }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <TimelineIcon
                    sx={{ 
                      fontSize: 40, 
                      color: "#9c27b0", 
                      mb: 1,
                      p: 1,
                      bgcolor: "rgba(156, 39, 176, 0.1)",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography variant="h4" component="div" color="#7b1fa2">
                    {leaderboardData.length > 0
                      ? formatPoints(
                          Math.round(
                            leaderboardData.reduce(
                              (sum, item) =>
                                sum + (item.points || item.score || 0),
                              0
                            ) / leaderboardData.length
                          )
                        )
                      : 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Points
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
              border: "1px solid rgba(123, 31, 162, 0.2)",
            }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <TrophyIcon
                    sx={{ 
                      fontSize: 40, 
                      color: "#9c27b0", 
                      mb: 1,
                      p: 1,
                      bgcolor: "rgba(156, 39, 176, 0.1)",
                      borderRadius: "50%",
                    }}
                  />
                  <Typography variant="h4" component="div" color="#7b1fa2">
                    {leaderboardData.length > 0
                      ? formatPoints(
                          leaderboardData[0].points ||
                            leaderboardData[0].score ||
                            0
                        )
                      : 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Highest Score
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Additional motivational section */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Keep learning to climb the leaderboard and unlock achievements!
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
            color: "white",
            "&:hover": {
              background: "linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)",
            },
          }}
        >
          Explore Courses
        </Button>
      </Box>
    </Container>
  );
};

export default Leaderboard;