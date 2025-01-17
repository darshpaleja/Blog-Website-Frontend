import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  IconButton,
  Avatar,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CodeIcon from "@mui/icons-material/Code";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "450px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const GradientBox = styled(Box)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(45deg, #1a237e 0%, #0d47a1 100%)"
      : "linear-gradient(45deg, #42a5f5 0%, #1976d2 100%)",
  borderRadius: theme.spacing(4),
  padding: theme.spacing(6),
  color: "#fff",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)",
  },
}));

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  width: "100%",
}));

const CarouselContent = styled(Box)(({ theme }) => ({
  display: "flex",
  transition: "transform 0.5s ease",
}));

const CarouselItem = styled(Box)(({ theme }) => ({
  flex: "0 0 auto",
  width: "calc(100% / 3)", // Default to 3 items per row
}));
function HomePage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const blogsPerPage = 3;

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://blog-backend-pdhw.onrender.com/blog/getBlog"
      );
      setData(res.data.Data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / blogsPerPage);

  const getCurrentBlogs = () => {
    const start = currentPage * blogsPerPage;
    const end = start + blogsPerPage;
    return data.slice(start, end);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      title: "Technical Articles",
      description: "Explore in-depth technical articles and tutorials",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: "Trending Topics",
      description: "Stay updated with the latest tech trends",
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: "Community",
      description: "Join our growing community of developers",
    },
  ];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Box sx={{ minHeight: "100vh", overflowX: "hidden" }}>
      {" "}
      {/* Prevent horizontal scrollbar */}
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: { xs: 7, md: 13 } }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Text Section */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                mb: 3,
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)"
                    : "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2rem", sm: "2.5rem", lg: "3rem" },
                textAlign: { xs: "left", sm: "left", md: "left" },
              }}
            >
              Share Your Knowledge
              <br />
              With The World
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 4,
                fontSize: { xs: "1rem", sm: "1.2rem", lg: "1.4rem" },
                textAlign: { xs: "left", sm: "left", md: "left" },
              }}
            >
              A platform for developers to share their experiences and learn
              from others
            </Typography>
            <Stack
              direction={{ xs: "row", sm: "row" }}
              spacing={2}
              justifyContent={{ xs: "start", sm: "start" }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/blogs")}
                sx={{
                  borderRadius: 2,
                  px: { xs: 3, md: 3.5 },
                  py: 1.5,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  transition: "0.2s ease-in-out",
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)"
                      : "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                }}
              >
                Explore Blogs
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/post-blog")}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  transition: "0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Start Writing
              </Button>
            </Stack>
          </Grid>

          {/* Right Image Section */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Box
              component="img"
              src="https://plus.unsplash.com/premium_photo-1723662114168-997f136a6759?q=80&w=1443&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 4,
                boxShadow: 8,
                transform: "perspective(1000px) rotateY(-15deg)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "perspective(1000px) rotateY(-5deg)",
                },
              }}
            />
          </Grid>
        </Grid>
      </Container>
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <StyledCard sx={{ height: "100%" }}>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      mb: 2,
                      color: "primary.main",
                      transform: "scale(1)",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1)",
                      },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Trending Posts Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 6, fontSize: { xs: "40px", sm: "45px", md: "48px" } }}
          >
            Trending Posts
          </Typography>
          <Grid container spacing={4}>
            {data.slice(0, 4).map((post, index) => (
              <Grid
                item
                xs={12} // Full width on extra small screens
                sm={6} // 2 cards per row on small screens
                md={3} // 3 cards per row on medium and larger screens
                key={index}
              >
                <StyledCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`https://blog-backend-pdhw.onrender.com/public/images/${post.image}`}
                    alt={post.title}
                  />
                  <CardContent
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between", // To space out the content
                      height: "auto", // Allow card content height to adjust based on content
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Chip
                        label={post.catID.blogCategory}
                        color="primary"
                        size="small"
                      />
                    </Stack>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        height: "auto", // Allow title to auto expand and wrap if needed
                        overflow: "hidden", // Prevent overflow
                        display: "-webkit-box",
                        WebkitLineClamp: 3, // Limit to 3 lines, if necessary
                        WebkitBoxOrient: "vertical",
                        fontWeight: "bold",
                        pb: { md: 0, xs: 2 },
                        fontSize: { md: "16px", sm: "20px", xs: "24px" },
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mt: "auto" }} // Push the author section to the bottom
                    >
                      <Avatar
                        sx={{
                          width: 45,
                          height: 45,
                          fontSize: "1.2rem",
                          bgcolor: "primary.main",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {getInitials(post.author_Name)}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {post.author_Name}
                      </Typography>
                    </Stack>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* CTA Section */}
      <Container sx={{ py: 8, width: "100%" }}>
  <GradientBox>
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={8}>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" }, 
            textAlign: { xs: "left" }, 
          }}
        >
          Ready to Share Your Story?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            opacity: 0.9,
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" }, 
            textAlign: { xs: "left" }, 
          }}
        >
          Join our community and start sharing your knowledge today
        </Typography>
        <Box sx={{ textAlign: { xs: "left" } }}> 
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/signup")}
            sx={{
              bgcolor: "white",
              color: "#1976D2",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
                transform: "translateX(8px)",
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Grid>
    </Grid>
  </GradientBox>
</Container>

    </Box>
  );
}

export default HomePage;
