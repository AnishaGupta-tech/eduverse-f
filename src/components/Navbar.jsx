import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import { useTheme, styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import {
  School as SchoolIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Custom purple palette
const purplePalette = {
  main: '#8a2be2',  // Proper purple color
  light: '#9d50e8',
  dark: '#7b1fa2',
  contrastText: '#ffffff',
};

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white",
  color: theme.palette.text.primary,
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  height: '80px',  // Increased navbar height
  justifyContent: 'center',
}));

const LogoBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
  marginRight: "16px",
  "&:hover": {
    opacity: 0.9,
  },
});

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: '1.05rem',  // Slightly larger font
  padding: '8px 16px',
  "&:hover": {
    color: purplePalette.main,
    backgroundColor: "transparent",
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  padding: "10px 28px",  // Larger button
  fontWeight: 600,  // Bolder text
  fontSize: '1.05rem',
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  backgroundColor: purplePalette.main,
  "&:hover": {
    backgroundColor: purplePalette.dark,
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  color: purplePalette.main,
  fontWeight: 600,
  fontSize: '1.05rem',
  padding: "10px 28px",
  "&:hover": {
    backgroundColor: `${purplePalette.light}20`,  // Light purple with opacity
  },
}));

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ minHeight: '80px' }}>  {/* Increased toolbar height */}
        {/* Logo */}
        <LogoBox component={RouterLink} to="/">
          <SchoolIcon
            sx={{
              backgroundColor: purplePalette.main,
              color: "white",
              p: 1.2,  // Larger padding
              borderRadius: 1,
              fontSize: "2.2rem",  // Larger icon
              mr: 1.5,
            }}
          />
          <Typography
            variant="h4"  // Larger text
            component="div"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: '1.8rem',  // Specific size
            }}
          >
            Eduverse  {/* Changed from EduSphere to Eduverse */}
          </Typography>
        </LogoBox>

        {/* Desktop Navigation */}
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}>
          <NavButton component={RouterLink} to="/courses">
            Courses
          </NavButton>
          <NavButton component={RouterLink} to="/mentors">
            Mentors
          </NavButton>
          <NavButton component={RouterLink} to="/pricing">
            Pricing
          </NavButton>
          <NavButton component={RouterLink} to="/about">
            About
          </NavButton>
        </Box>

        {/* Auth Buttons - Desktop */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user ? (
              <>
                <PrimaryButton
                  component={RouterLink}
                  to="/dashboard"
                  variant="contained"
                >
                  Dashboard
                </PrimaryButton>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar
                    alt={user.name}
                    src={user.avatar}
                    sx={{
                      width: 40,  // Larger avatar
                      height: 40,
                      border: "2px solid",
                      borderColor: purplePalette.main,
                    }}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: '200px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    }
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <SecondaryButton component={RouterLink} to="/login">
                  Login
                </SecondaryButton>
                <PrimaryButton
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                >
                  Sign Up
                </PrimaryButton>
              </>
            )}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuToggle}
            sx={{ 
              ml: "auto",
              '& svg': { fontSize: '2rem' }  // Larger mobile menu icon
            }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            pb: 3,  // More padding
            px: 3,
          }}
        >
          <NavButton
            fullWidth
            component={RouterLink}
            to="/courses"
            sx={{ 
              justifyContent: "flex-start", 
              py: 2,  // Larger tap targets
              fontSize: '1.1rem'
            }}
          >
            Courses
          </NavButton>
          <NavButton
            fullWidth
            component={RouterLink}
            to="/mentors"
            sx={{ 
              justifyContent: "flex-start", 
              py: 2,
              fontSize: '1.1rem'
            }}
          >
            Mentors
          </NavButton>
          <NavButton
            fullWidth
            component={RouterLink}
            to="/pricing"
            sx={{ 
              justifyContent: "flex-start", 
              py: 2,
              fontSize: '1.1rem'
            }}
          >
            Pricing
          </NavButton>
          <NavButton
            fullWidth
            component={RouterLink}
            to="/about"
            sx={{ 
              justifyContent: "flex-start", 
              py: 2,
              fontSize: '1.1rem'
            }}
          >
            About
          </NavButton>

          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            {user ? (
              <>
                <PrimaryButton
                  fullWidth
                  component={RouterLink}
                  to="/dashboard"
                  variant="contained"
                  sx={{ 
                    mb: 2, 
                    py: 1.8,
                    fontSize: '1.1rem'
                  }}
                >
                  Dashboard
                </PrimaryButton>
                <Button
                  fullWidth
                  onClick={handleMenuOpen}
                  sx={{
                    justifyContent: "flex-start",
                    py: 1.8,
                    color: "text.primary",
                    fontSize: '1.1rem'
                  }}
                >
                  <Avatar
                    alt={user.name}
                    src={user.avatar}
                    sx={{
                      width: 30,
                      height: 30,
                      mr: 2,
                      border: "1px solid",
                      borderColor: purplePalette.main,
                    }}
                  />
                  Profile
                </Button>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 2 }}>
                <SecondaryButton
                  fullWidth
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    py: 1.8,
                    fontSize: '1.1rem'
                  }}
                >
                  Login
                </SecondaryButton>
                <PrimaryButton
                  fullWidth
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{ 
                    py: 1.8,
                    fontSize: '1.1rem'
                  }}
                >
                  Sign Up
                </PrimaryButton>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </StyledAppBar>
  );
};

export default Navbar;