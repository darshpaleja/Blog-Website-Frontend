import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CardMedia,
  Chip,
  Divider,
  Avatar,
  useTheme,
  Stack,
  IconButton,
  Fade,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { jwtDecode } from "jwt-decode";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  WhatsApp as WhatsAppIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function Blog() {
  const [data, setData] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [commentValue, setCommentValue] = useState({
    blogID: "",
    userName: "",
    comment: "",
  });
  const [commentData, setCommentData] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [selectedBlogForShare, setSelectedBlogForShare] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  // console.log(selectedCategory , 'selectedCategory');

  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState(true);

  const [likes, setLikes] = useState([]);
  const [isLiking, setIsLiking] = useState(false);
  const [likeCounts, setLikeCounts] = useState({});

  const decodedToken = jwtDecode(token);

  // Fetch Category Data
  const fetchCategoryData = async () => {
    await axios
      .get("https://blog-backend-pdhw.onrender.com/category/getCategory")
      .then((res) => {
        setCategories(res.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fetch Category Data by id
  const fetchCategoryDataById = async (id) => {
    await axios
      .get(`https://blog-backend-pdhw.onrender.com/blog/getBlogByCategoryId/${id}`)
      .then((res) => {
        // console.log(res.data.Data , 'blogs by category id');
        setData(res.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (e.target.value === "all") {
      setAllCategories(true);
      fetchData(); // This will fetch all blogs
    } else {
      setAllCategories(false);
      fetchCategoryDataById(e.target.value);
    }
  };

  // Fetch blogs data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://blog-backend-pdhw.onrender.com/blog/getBlog");
      setData(res.data.Data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategoryData();
  }, []);

  // Delete Blog
  const handleDelete = async (id) => {
    console.log(id, "id");
    try {
      await axios.delete(`https://blog-backend-pdhw.onrender.com/blog/deleteBlog/${id}`);
      // console.log(res);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleVisibility = (id) => {
    setVisiblePosts((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getRandomNumber = () => Math.floor(Math.random() * 1000) + 100;

  //  get comment by blog id
  const fetchCommentByBlogId = async (blogId) => {
    try {
      const res = await axios.get(
        `https://blog-backend-pdhw.onrender.com/comment/getCommentByBlogId/${blogId}`
      );
      setCommentData(res.data.Data);
    } catch (error) {
      console.error(error);
    }
  };

  // handle comment click
  const handleCommentClick = (blog) => {
    fetchCommentByBlogId(blog._id);
    setOpenCommentDialog(true);
    setCommentValue({
      blogID: blog._id,
      userName: decodedToken.name,
      comment: "",
    });
  };

  // Fetch Comment
  const fetchComment = async () => {
    const res = await axios.get("https://blog-backend-pdhw.onrender.com/comment/getComment");
    setCommentData(res.data.Data);
  };

  useEffect(() => {
    fetchComment();
  }, []);

  // Comment Submit
  const handleCommentSubmit = async () => {
    try {
      await axios.post(
        "https://blog-backend-pdhw.onrender.com/comment/addComment",
        commentValue
      );
      // Update counts after adding new comment
      setCommentCounts((prev) => ({
        ...prev,
        [commentValue.blogID]: (prev[commentValue.blogID] || 0) + 1,
      }));
      fetchCommentByBlogId(commentValue.blogID);
      setCommentValue({
        blogID: "",
        userName: decodedToken.name,
        comment: "",
      });
      setOpenCommentDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Add this function to fetch all comments initially
  const fetchAllComments = async () => {
    try {
      const res = await axios.get("https://blog-backend-pdhw.onrender.com/comment/getComment");
      const comments = res.data.Data;

      const counts = comments.reduce((acc, comment) => {
        acc[comment.blogID] = (acc[comment.blogID] || 0) + 1;
        return acc;
      }, {});

      setCommentCounts(counts);
      setCommentData(comments);
    } catch (error) {
      console.error(error);
    }
  };

  // Use useEffect to fetch comments when component mounts
  useEffect(() => {
    fetchAllComments();
  }, []);

  // Handle share menu
  const handleShareClick = (event, blog) => {
    setShareAnchorEl(event.currentTarget);
    setSelectedBlogForShare(blog);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
    setSelectedBlogForShare(null);
  };

  // Share functions
  const handleShare = (platform) => {
    const blogUrl = `${window.location.origin}/blog/${selectedBlogForShare._id}`;
    const title = selectedBlogForShare.title;
    let shareUrl;

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + blogUrl)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(blogUrl);
        setSnackbar({
          open: true,
          message: "Link copied to clipboard!",
          severity: "success",
        });
        handleShareClose();
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
    handleShareClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Add function to fetch user's bookmarks
  const fetchUserBookmarks = async () => {
    try {
      const response = await axios.get(
        `https://blog-backend-pdhw.onrender.com/bookmark/getUserBookmark/${decodedToken.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const bookmarkedBlogIds = response.data.data.map(
        (bookmark) => bookmark.blogId._id
      );
      setBookmarks(bookmarkedBlogIds);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  // Add useEffect to fetch bookmarks when component mounts
  useEffect(() => {
    if (token) {
      fetchUserBookmarks();
    }
  }, [token]);

  const handleBookmark = async (blogId) => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please login to bookmark blogs",
        severity: "warning",
      });
      return;
    }

    try {
      setIsBookmarking(true);
      if (bookmarks.includes(blogId)) {
        // Remove bookmark
        await axios.delete(
          `https://blog-backend-pdhw.onrender.com/bookmark/removeBookmark/${decodedToken.id}/${blogId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setBookmarks((prev) => prev.filter((id) => id !== blogId));
        setSnackbar({
          open: true,
          message: "Bookmark removed successfully",
          severity: "success",
        });
      } else {
        // Add bookmark
        await axios.post(
          "https://blog-backend-pdhw.onrender.com/bookmark/addBookmark",
          {
            userId: decodedToken.id,
            blogId: blogId,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setBookmarks((prev) => [...prev, blogId]);
        setSnackbar({
          open: true,
          message: "Blog bookmarked successfully",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating bookmark",
        severity: "error",
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  // Add function to fetch user's likes
  const fetchUserLikes = async () => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const response = await axios.get(
          `https://blog-backend-pdhw.onrender.com/like/getUserLikes/${decoded.id}`
        );
        const likedBlogIds = response.data.data.map((like) => like.blogId._id);
        setLikes(likedBlogIds);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    }
  };

  // Add function to fetch like counts
  const fetchLikeCounts = async () => {
    try {
      const promises = data.map((blog) =>
        axios.get(`https://blog-backend-pdhw.onrender.com/like/getBlogLikeCount/${blog._id}`)
      );
      const responses = await Promise.all(promises);
      const counts = {};
      responses.forEach((response, index) => {
        counts[data[index]._id] = response.data.count;
      });
      setLikeCounts(counts);
    } catch (error) {
      console.error("Error fetching like counts:", error);
    }
  };

  // Add useEffect to fetch likes and counts
  useEffect(() => {
    fetchUserLikes();
    fetchLikeCounts();
  }, [token, data]);

  // Add handleLike function
  const handleLike = async (blogId) => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Please login to like blogs",
        severity: "warning",
      });
      return;
    }

    try {
      setIsLiking(true);
      const decoded = jwtDecode(token);

      if (likes.includes(blogId)) {
        // Remove like
        await axios.delete(
          `https://blog-backend-pdhw.onrender.com/like/removeLike/${decoded.id}/${blogId}`
        );
        setLikes((prev) => prev.filter((id) => id !== blogId));
        setLikeCounts((prev) => ({
          ...prev,
          [blogId]: (prev[blogId] || 0) - 1,
        }));
      } else {
        // Add like
        await axios.post("https://blog-backend-pdhw.onrender.com/like/addLike", {
          userId: decoded.id,
          blogId: blogId,
        });
        setLikes((prev) => [...prev, blogId]);
        setLikeCounts((prev) => ({
          ...prev,
          [blogId]: (prev[blogId] || 0) + 1,
        }));
      }
    } catch (error) {
      console.error("Error updating like:", error);
      setSnackbar({
        open: true,
        message: "Error updating like",
        severity: "error",
      });
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        {[1, 2].map((index) => (
          <Paper
            key={`skeleton-${index}`}
            sx={{ mb: 4, p: 3, borderRadius: 3 }}
          >
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ mb: 2, borderRadius: 2 }}
            />
            <Skeleton variant="text" height={60} width="80%" />
            <Skeleton variant="text" height={30} width="40%" />
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ my: 2 }}
            >
              <Skeleton variant="circular" width={60} height={60} />
              <Skeleton variant="text" width={200} />
            </Stack>
          </Paper>
        ))}
      </Container>
    );
  }

  return (
    <>
      {token ? (
        <>
          <Box
            sx={{
              bgcolor: 'background.default',
              color: 'text.primary',
              minHeight: '100vh',
              overflowX: 'hidden', // Prevent horizontal scroll
            }}
          >
            <Container 
              maxWidth="lg" 
              sx={{ 
                py: 4,
                px: { xs: 1.5, sm: 2, md: 3 }, // Reduced padding for smaller screens
              }}
            >
              {/* Category Filter */}
              <FormControl 
                fullWidth 
                variant="outlined" 
                sx={{ 
                  mb: 4,
                  maxWidth: '100%' 
                }}
              >
                <InputLabel>Filter by Category</InputLabel>
                <Select
                  value={selectedCategory || 'all'}
                  onChange={handleCategoryChange}
                  label="Filter by Category"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.blogCategory}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Blog Cards */}
              {data.map((blog) => (
                <Paper
                  key={blog._id}
                  elevation={3}
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    overflow: 'hidden',
                    width: '100%',
                    boxSizing: 'border-box', // Important for padding calculation
                  }}
                >
                  {/* Blog Content */}
                  <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    {/* Author Info and Category */}
                    <Stack 
                      direction="row" 
                      alignItems="center" 
                      spacing={2}
                      sx={{ 
                        flexWrap: 'wrap', // Allow wrapping on small screens
                        gap: 1 
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: "primary.main",
                          boxShadow: 2,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {getInitials(blog.author_Name)}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {blog.author_Name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTimeIcon
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(blog.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </Typography>
                        </Stack>
                      </Box>
                      <Chip
                        label={blog.catID.blogCategory}
                        color="primary"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          "&:hover": { transform: "scale(1.05)" },
                          transition: "transform 0.2s ease",
                          background:
                            "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Image and Content Grid */}
                  <Grid 
                    container 
                    spacing={0}
                    sx={{ 
                      width: '100%',
                      m: 0 
                    }}
                  >
                    {/* Image Section */}
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          position: 'relative',
                          height: { xs: 250, sm: 300 },
                          m: { xs: 1.5, sm: 2, md: 3 }, // Adjusted margins
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={`https://blog-backend-pdhw.onrender.com/public/images/${blog.image}`}
                          alt={blog.title}
                          sx={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background:
                              "linear-gradient(transparent, rgba(0,0,0,0.7))",
                            color: "white",
                            p: 2,
                          }}
                        >
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {blog.title}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Content Section */}
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        p: { xs: 1.5, sm: 2, md: 3 }, // Adjusted padding
                        height: '100%',
                      }}>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "text.secondary",
                            lineHeight: 1.8,
                            ...(!visiblePosts[blog._id] && {
                              display: "-webkit-box",
                              WebkitLineClamp: 6,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }),
                          }}
                        >
                          {blog.content}
                        </Typography>

                        <Button
                          variant="text"
                          onClick={() => handleVisibility(blog._id)}
                          endIcon={
                            visiblePosts[blog._id] ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )
                          }
                          sx={{
                            mt: 2,
                            textTransform: "none",
                            fontWeight: 500,
                            color: "primary.main",
                            borderRadius: 2,
                            px: 2,
                            "&:hover": {
                              bgcolor: "action.hover",
                              transform: "translateY(-2px)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          {visiblePosts[blog._id] ? "Show Less" : "Read More"}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Actions Section */}
                  <Box sx={{ 
                    px: { xs: 1.5, sm: 2, md: 3 }, // Adjusted padding
                    pb: 2 
                  }}>
                    <Divider sx={{ mb: 2 }} />
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={2}>
                        <Button
                          startIcon={
                            likes.includes(blog._id) ? (
                              <ThumbUpIcon />
                            ) : (
                              <ThumbUpOutlinedIcon />
                            )
                          }
                          onClick={() => handleLike(blog._id)}
                          disabled={isLiking}
                          color={
                            likes.includes(blog._id) ? "primary" : "inherit"
                          }
                          sx={{
                            borderRadius: 2,
                            px: 3,
                            "&:hover": {
                              transform: "translateY(-2px)",
                              bgcolor: likes.includes(blog._id)
                                ? "primary.dark"
                                : "action.hover",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          {likeCounts[blog._id] || 0}
                        </Button>

                        <Button
                          startIcon={<CommentIcon />}
                          onClick={() => handleCommentClick(blog)}
                          sx={{
                            borderRadius: 2,
                            px: 3,
                            "&:hover": {
                              transform: "translateY(-2px)",
                              bgcolor: "action.hover",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          {commentCounts[blog._id] || 0}
                        </Button>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <IconButton
                          onClick={(e) => handleShareClick(e, blog)}
                          sx={{
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.1) rotate(10deg)",
                              color: "primary.main",
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          <ShareIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => handleBookmark(blog._id)}
                          disabled={isBookmarking}
                          color={
                            bookmarks.includes(blog._id) ? "primary" : "default"
                          }
                          sx={{
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          {bookmarks.includes(blog._id) ? (
                            <BookmarkIcon />
                          ) : (
                            <BookmarkBorderIcon />
                          )}
                        </IconButton>

                        <IconButton
                          onClick={() => navigate(`/edit-blog/${blog._id}`)}
                          sx={{
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.1) rotate(-10deg)",
                              color: "primary.main",
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => handleDelete(blog._id)}
                          sx={{
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.1) rotate(10deg)",
                              color: "error.main",
                              bgcolor: "error.light",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>

                  {/* Share Menu with Animation */}
                  <Menu
                    anchorEl={shareAnchorEl}
                    open={Boolean(shareAnchorEl)}
                    onClose={handleShareClose}
                    TransitionComponent={Fade}
                    sx={{ mt: 1 }}
                    PaperProps={{
                      elevation: 8,
                      sx: {
                        borderRadius: 3,
                        minWidth: 250,
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <Box sx={{ py: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ px: 2, pb: 1, color: "text.secondary" }}
                      >
                        Share via
                      </Typography>
                      {[
                        {
                          icon: <FacebookIcon />,
                          name: "Facebook",
                          color: "#1877f2",
                          platform: "facebook",
                        },
                        {
                          icon: <TwitterIcon />,
                          name: "Twitter",
                          color: "#1da1f2",
                          platform: "twitter",
                        },
                        {
                          icon: <LinkedInIcon />,
                          name: "LinkedIn",
                          color: "#0077b5",
                          platform: "linkedin",
                        },
                        {
                          icon: <WhatsAppIcon />,
                          name: "WhatsApp",
                          color: "#25d366",
                          platform: "whatsapp",
                        },
                      ].map((item) => (
                        <MenuItem
                          key={item.platform}
                          onClick={() => handleShare(item.platform)}
                          sx={{
                            py: 1.5,
                            mx: 1,
                            borderRadius: 2,
                            "&:hover": {
                              bgcolor: `${item.color}15`,
                            },
                          }}
                        >
                          <ListItemIcon sx={{ color: item.color }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.name}
                            primaryTypographyProps={{
                              sx: { fontWeight: 500 },
                            }}
                          />
                        </MenuItem>
                      ))}
                      <Divider sx={{ my: 1 }} />
                      <MenuItem
                        onClick={() => handleShare("copy")}
                        sx={{
                          py: 1.5,
                          mx: 1,
                          borderRadius: 2,
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <ContentCopyIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Copy Link"
                          primaryTypographyProps={{
                            sx: { fontWeight: 500 },
                          }}
                        />
                      </MenuItem>
                    </Box>
                  </Menu>
                </Paper>
              ))}
            </Container>

            <Dialog
              open={openCommentDialog}
              onClose={() => setOpenCommentDialog(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Comments</DialogTitle>
              <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  {/* Existing Comments */}
                  {commentData.map((comment) => (
                    <Paper
                      key={comment._id}
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "grey.800"
                            : "grey.50",
                        borderRadius: 2,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {getInitials(comment.userName)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {comment.userName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant="body2">{comment.comment}</Typography>
                    </Paper>
                  ))}

                  {/* New Comment Form */}
                  <Box sx={{ mt: 3 }}>
                    <TextField
                      fullWidth
                      label="Write a comment..."
                      multiline
                      rows={3}
                      value={commentValue.comment}
                      onChange={(e) =>
                        setCommentValue({
                          ...commentValue,
                          comment: e.target.value,
                        })
                      }
                      sx={{ mb: 2 }}
                    />
                  </Box>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ pb: 2 }}>
                <Button onClick={() => setOpenCommentDialog(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCommentSubmit}
                  disabled={!commentValue.comment}
                >
                  Post Comment
                </Button>
              </DialogActions>
            </Dialog>

            {/* Snackbar for copy link */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbar.severity}
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </>
      ) : (
        <>{navigate("/signup")}</>
      )}
    </>
  );
}

export default Blog;
