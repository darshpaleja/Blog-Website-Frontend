import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Stack,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import {
  ThumbUp,
  Bookmark,
  Comment,
  ArrowBack,
  Close,
} from "@mui/icons-material";
import { MdOutlinePostAdd } from "react-icons/md";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [commentedBlogs, setCommentedBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openBlogDialog, setOpenBlogDialog] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch user data
  const getUser = async () => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const response = await axios.get(
          `https://blog-backend-pdhw.onrender.com/users/getUserById/${decoded.id}`
        );
        setUser(response.data.Data);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    }
  };

  // Fetch liked blogs
  const getLikedBlogs = async () => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const response = await axios.get(
          `https://blog-backend-pdhw.onrender.com/like/getUserLikes/${decoded.id}`
        );
        setLikedBlogs(response.data.data || []);
      } catch (error) {
        console.log("Error fetching likes:", error);
      }
    }
  };

  // Fetch bookmarked blogs
  const getBookmarkedBlogs = async () => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const response = await axios.get(
          `https://blog-backend-pdhw.onrender.com/bookmark/getUserBookmark/${decoded.id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setBookmarkedBlogs(response.data.data || []);
      } catch (error) {
        console.log("Error fetching bookmarks:", error);
      }
    }
  };

  // Fetch commented blogs
  const getCommentedBlogs = async () => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const response = await axios.get(
          `https://blog-backend-pdhw.onrender.com/comment/getCommentByUserName/${decoded.name}`
        );
        setCommentedBlogs(response.data.Data || []);
      } catch (error) {
        console.log("Error fetching comments:", error);
      }
    }
  };
  useEffect(() => {
    getUser();
    getLikedBlogs();
    getBookmarkedBlogs();
    getCommentedBlogs();
  }, [token]);

  const handleReadMore = async (blogId) => {
    try {
      const response = await axios.get(
        `https://blog-backend-pdhw.onrender.com/blog/getBlog/${blogId}`
      );
      setSelectedBlog(response.data.Data);
      setOpenBlogDialog(true);
    } catch (error) {
      console.log("Error fetching blog:", error);
    }
  };

  const handleCloseBlog = () => {
    setOpenBlogDialog(false);
    setSelectedBlog(null);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          bgcolor: "#0A1929",
          color: "#fff",
          minHeight: "100vh",
          transition: "background-color 0.3s, color 0.3s",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/blogs")}
              sx={{
                background: "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                color: "#fff",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Back to Blogs
            </Button>
            <Button
              variant="contained"
              startIcon={<MdOutlinePostAdd size={22} />}
              onClick={() => navigate("/post-blog")}
              sx={{
                background: "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                color: "#fff",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Create New Blog
            </Button>
          </Box>

          {/* Profile Header */}
          <Card
            sx={{
              mb: 4,
              bgcolor: "#1A2027",
              borderRadius: 2,
              boxShadow: "none",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Avatar
                  sx={{
                    width: { xs: 60, sm: 70, md: 80 }, // Responsive width
                    height: { xs: 60, sm: 70, md: 80 }, // Responsive height
                    background:
                      "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                    fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" }, // Responsive font size
                  }}
                >
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : ""}
                </Avatar>

                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "#fff",
                      mb: 1,
                    }}
                  >
                    {user?.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Tabs and Content */}
          <Card
            sx={{
              bgcolor: "#1A2027",
              borderRadius: 2,
              boxShadow: "none",
              border: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                borderBottom: 1,
                borderColor: "rgba(255, 255, 255, 0.12)",
                "& .MuiTab-root": {
                  color: "#fff",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&.Mui-selected": {
                    color: "#90caf9",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#90caf9",
                },
              }}
            >
              <Tab
                icon={<ThumbUp sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Liked Blogs"
              />
              <Tab
                icon={<Bookmark sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Bookmarked"
              />
              <Tab
                icon={<Comment sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Commented"
              />
            </Tabs>

            {/* Liked Blogs Tab */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {likedBlogs.map((item) => (
                    <Card
                      key={item._id}
                      sx={{
                        bgcolor: "#1A2027",
                        boxShadow: "none",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 2,
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                          borderColor: "#90caf9",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "#90caf9",
                            mb: 1,
                          }}
                        >
                          {item.blogId.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            mb: 2,
                            fontSize: "12px",
                          }}
                        >
                          Author : {item.blogId?.author_Name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#90caf9",
                              fontWeight: 500,
                            }}
                          >
                            {format(new Date(item.createdAt), "PPP")}
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={() => handleReadMore(item.blogId._id)}
                            sx={{
                              background:
                                "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                              color: "#fff",
                              textTransform: "none",
                              fontSize: "0.9rem",
                              fontWeight: 500,
                              "&:hover": {
                                background:
                                  "linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)",
                                transform: "translateY(-2px)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            Read More
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Bookmark */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                {bookmarkedBlogs.length === 0 ? (
                  <Typography
                    variant="h6"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textAlign: "center",
                      mt: 5,
                    }}
                  >
                    You have no bookmarked blogs.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {bookmarkedBlogs.map((item) => (
                      <Card
                        key={item._id}
                        sx={{
                          bgcolor: "#1A2027",
                          boxShadow: "none",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: 2,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                            borderColor: "#90caf9",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: "#90caf9",
                              mb: 1,
                            }}
                          >
                            {item.blogId?.title || "No Title"}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.7)",
                              mb: 2,
                              fontSize: "12px",
                            }}
                          >
                            Author : {item.blogId?.author_Name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#90caf9",
                                fontWeight: 500,
                              }}
                            >
                              {format(new Date(item.createdAt), "PPP")}
                            </Typography>
                            <Button
                              variant="contained"
                              onClick={() => handleReadMore(item.blogId?._id)}
                              sx={{
                                background:
                                  "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                                color: "#fff",
                                textTransform: "none",
                                fontSize: "0.9rem",
                                fontWeight: 500,
                                "&:hover": {
                                  background:
                                    "linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.3s ease",
                              }}
                            >
                              Read More
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>
            )}

            {/* Comment */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {commentedBlogs.map((item) => (
                    <Card
                      key={item._id}
                      sx={{
                        bgcolor: "#1A2027",
                        boxShadow: "none",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 2,
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                          borderColor: "#90caf9",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "#90caf9",
                            mb: 1,
                          }}
                        >
                          {item.blogID?.title || "No Title"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            mb: 2,
                            fontSize: "12px",
                          }}
                        >
                          Author : {item.blogID?.author_Name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            mb: 2,
                            fontStyle: "italic",
                          }}
                        >
                          Your comment: "{item.comment}"
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#90caf9",
                              fontWeight: 500,
                            }}
                          >
                            {format(new Date(item.createdAt), "PPP")}
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={() => handleReadMore(item.blogID?._id)}
                            sx={{
                              background:
                                "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                              color: "#fff",
                              textTransform: "none",
                              fontSize: "0.9rem",
                              fontWeight: 500,
                              "&:hover": {
                                background:
                                  "linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)",
                                transform: "translateY(-2px)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            Read More
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}
          </Card>
        </Container>
      </Box>
      {/* Blog Dialog */}
      <Dialog
        open={openBlogDialog}
        onClose={handleCloseBlog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#1A2027",
            color: "#fff",
            minHeight: "80vh",
            maxHeight: "90vh",
          },
        }}
      >
        {/* Replaced DialogTitle with Box */}
        <Box
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#90caf9",
              fontWeight: "bold",
            }}
          >
            {selectedBlog?.title}
          </Typography>
          <IconButton
            onClick={handleCloseBlog}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": { color: "#fff" },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Image Container */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
            width: "100%",
            p: 2,
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <img
            src={`https://blog-backend-pdhw.onrender.com/public/images/${selectedBlog?.image}`}
            alt={selectedBlog?.title}
            style={{
              width: "80%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
        </Box>

        {/* Content */}
        <DialogContent sx={{ p: 3 }}>
          {selectedBlog && (
            <>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  mb: 2,
                  lineHeight: 1.8,
                }}
              >
                {selectedBlog.content}
              </Typography>
              <Box
                sx={{
                  mt: 4,
                  pt: 2,
                  borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Author: {selectedBlog.author_Name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Published: {format(new Date(selectedBlog.createdAt), "PPP")}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Profile;
