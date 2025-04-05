import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Alert,
  styled,
} from "@mui/material";
import api from "../services/api";

// Custom styled components
const PurplePaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  background: "linear-gradient(145deg, #f0e6ff, #d9c0ff)",
  boxShadow: "0 8px 32px rgba(103, 58, 183, 0.2)",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  padding: theme.spacing(4),
}));

const PurpleButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #7b1fa2 0%, #9c27b0 100%)",
  color: "white",
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: "12px",
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(45deg, #6a1b9a 0%, #8e24aa 100%)",
    boxShadow: "0 4px 12px rgba(123, 31, 162, 0.4)",
  },
  "&:disabled": {
    background: "#e0e0e0",
  },
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  border: "2px solid #7b1fa2",
  color: "#7b1fa2",
  fontWeight: 600,
  padding: "10px 24px",
  borderRadius: "12px",
  textTransform: "none",
  "&:hover": {
    border: "2px solid #6a1b9a",
    background: "rgba(123, 31, 162, 0.08)",
  },
}));

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    level: "beginner",
    category: "programming",
    thumbnail: "",
    discount: "0",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/courses", formData);
      navigate(`/mentor/courses/${response.data.data._id}/modules`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 2,
            background: "linear-gradient(45deg, #7b1fa2, #9c27b0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create New Course
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "text.secondary", maxWidth: "600px", textAlign: "center" }}
        >
          Design your perfect learning experience with our easy-to-use course
          creation tools
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: "12px",
            borderLeft: "4px solid #d32f2f",
          }}
        >
          {error}
        </Alert>
      )}

      <PurplePaper elevation={3}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Course Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#b39ddb",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7b1fa2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#7b1fa2",
                      boxShadow: "0 0 0 2px rgba(123, 31, 162, 0.2)",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#b39ddb",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7b1fa2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#7b1fa2",
                      boxShadow: "0 0 0 2px rgba(123, 31, 162, 0.2)",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Price ($)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#b39ddb",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7b1fa2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#7b1fa2",
                      boxShadow: "0 0 0 2px rgba(123, 31, 162, 0.2)",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Discount (%)"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#b39ddb",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7b1fa2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#7b1fa2",
                      boxShadow: "0 0 0 2px rgba(123, 31, 162, 0.2)",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                select
                label="Level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#b39ddb",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7b1fa2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#7b1fa2",
                      boxShadow: "0 0 0 2px rgba(123, 31, 162, 0.2)",
                    },
                  },
                }}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#b39ddb",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7b1fa2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#7b1fa2",
                      boxShadow: "0 0 0 2px rgba(123, 31, 162, 0.2)",
                    },
                  },
                }}
              >
                <MenuItem value="programming">Programming</MenuItem>
                <MenuItem value="design">Design</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Thumbnail URL"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": {
                      borderColor: "#b39ddb",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7b1fa2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#7b1fa2",
                      boxShadow: "0 0 0 2px rgba(123, 31, 162, 0.2)",
                    },
                  },
                }}
              />
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
                <OutlinedButton
                  onClick={() => navigate("/mentor/dashboard")}
                >
                  Cancel
                </OutlinedButton>
                <PurpleButton type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Course"}
                </PurpleButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </PurplePaper>
    </Container>
  );
};

export default CreateCourse;