import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  styled,
} from "@mui/material";
import mentorService from "../services/mentorService";
import {
  Title as TitleIcon,
  Description,
  AttachMoney,
  School,
  Category,
  Image,
  Public,
} from "@mui/icons-material";

// Styled Components
const PurplePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  background: "#ffffff",
  boxShadow: "0 8px 32px rgba(103, 58, 183, 0.1)",
  border: "1px solid rgba(156, 39, 176, 0.1)",
}));

const FormHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "2rem",
  background: "linear-gradient(45deg, #7b1fa2, #9c27b0)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: theme.spacing(1),
}));

const PurpleButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #7b1fa2 0%, #9c27b0 100%)",
  color: "white",
  fontWeight: 600,
  padding: "12px 28px",
  borderRadius: "12px",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    background: "linear-gradient(45deg, #6a1b9a 0%, #8e24aa 100%)",
    boxShadow: "0 4px 12px rgba(123, 31, 162, 0.3)",
  },
  "&:disabled": {
    background: "#e0e0e0",
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  border: "1px solid #b39ddb",
  color: "#7b1fa2",
  fontWeight: 500,
  padding: "12px 28px",
  borderRadius: "12px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(123, 31, 162, 0.04)",
    borderColor: "#7b1fa2",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    "& fieldset": {
      borderColor: "#e0d0f5",
    },
    "&:hover fieldset": {
      borderColor: "#b39ddb",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#7b1fa2",
      borderWidth: "1px",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#9575cd",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#7b1fa2",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: "12px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#e0d0f5",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#b39ddb",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#7b1fa2",
    borderWidth: "1px",
  },
}));

const CourseForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    level: "beginner",
    category: "",
    thumbnail: "",
    status: "draft",
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getCourseById(courseId);
      if (response.status === "success") {
        const course = response.data;
        setFormData({
          title: course.title,
          description: course.description,
          price: course.price,
          level: course.level,
          category: course.category,
          thumbnail: course.thumbnail,
          status: course.status,
        });
      }
    } catch (error) {
      setError("Failed to load course data");
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (courseId) {
        await mentorService.updateCourse(courseId, formData);
      } else {
        await mentorService.createCourse(formData);
      }

      navigate("/mentor/dashboard");
    } catch (error) {
      setError(error.message || "Failed to save course");
      console.error("Error saving course:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && courseId) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f9f0ff 0%, #e3f2fd 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#7b1fa2" }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <FormHeader variant="h4" component="h1">
          {courseId ? "Edit Course" : "Create New Course"}
        </FormHeader>
        <Typography color="text.secondary">
          {courseId ? "Update your course details" : "Build your knowledge and share it with the world"}
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: "12px",
            background: "#fce4ec",
            color: "#c2185b",
          }}
        >
          {error}
        </Alert>
      )}

      <PurplePaper elevation={0}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledTextField
                required
                fullWidth
                label="Course Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon sx={{ color: "#7e57c2" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description sx={{ color: "#7e57c2", mt: -18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                required
                fullWidth
                type="number"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney sx={{ color: "#7e57c2" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: "#9575cd" }}>Level</InputLabel>
                <StyledSelect
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  label="Level"
                  startAdornment={
                    <InputAdornment position="start">
                      <School sx={{ color: "#7e57c2" }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </StyledSelect>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                required
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Category sx={{ color: "#7e57c2" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledTextField
                required
                fullWidth
                label="Thumbnail URL"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Image sx={{ color: "#7e57c2" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: "#9575cd" }}>Status</InputLabel>
                <StyledSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  startAdornment={
                    <InputAdornment position="start">
                      <Public sx={{ color: "#7e57c2" }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </StyledSelect>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <SecondaryButton onClick={() => navigate("/mentor/dashboard")}>
                  Cancel
                </SecondaryButton>
                <PurpleButton type="submit" disabled={loading}>
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : courseId ? (
                    "Update Course"
                  ) : (
                    "Create Course"
                  )}
                </PurpleButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </PurplePaper>
    </Container>
  );
};

export default CourseForm;