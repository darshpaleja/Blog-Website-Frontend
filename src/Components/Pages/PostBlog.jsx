import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function PostBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [updateBlog, setUpdateBlog] = useState(null);
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  const userID = decodedToken.id;

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    autoHideDuration: 6000,
    variant: "filled",
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch User Data
  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `https://blog-backend-pdhw.onrender.com/users/getUserById/${userID}`
      );
      setUserData(res.data.Data);

      setValue((prev) => ({
        ...prev,
        author_Name: res.data.Data.name,
        address: res.data.Data.email,
      }));
    } catch (err) {
      console.log(err, "error");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Form Data
  const [value, setValue] = useState({
    title: "",
    content: "",
    author_Name: "",
    address: "",
    catID: "",
    image: "",
  });
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [blogCategory, setBlogCategory] = useState("");

  useEffect(() => {
    if (updateBlog) {
      setValue({
        title: updateBlog.title || "",
        content: updateBlog.content || "",
        author_Name: userData.name || "",
        address: userData.email || "",
        catID: updateBlog.catID._id || "",
        image: updateBlog.image || "",
      });
      if (updateBlog.image) {
        setImagePreview(updateBlog.image);
        setImage(null);
      }
    }
  }, [updateBlog]);

  // Fetch Categories
  const fetchCategories = async () => {
    const res = await axios.get(
      "https://blog-backend-pdhw.onrender.com/category/getCategory"
    );
    setCategories(res.data.Data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInput = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Add New Category
  const handleAddCategory = async () => {
    axios
      .post("https://blog-backend-pdhw.onrender.com/category/addCategory", {
        blogCategory: blogCategory,
      })
      .then((res) => {
        setShowAddCategory(false);
        setBlogCategory("");
        fetchCategories();
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", value.title);
    formData.append("content", value.content);
    formData.append("author_Name", userData.name);
    formData.append("address", userData.email);
    formData.append("catID", value.catID);

    // Only append new image if it exists
    if (image) {
      formData.append("image", image);
    } else if (value.image) {
      // Keep existing image if no new image is selected
      formData.append("image", value.image);
    }

    if (isEditing) {
      try {
        const res = await axios.patch(
          `https://blog-backend-pdhw.onrender.com/blog/updateBlog/${id}`,
          formData
        );
        if (res.status === 200) {
          navigate("/blogs");
          setSnackbar({
            open: true,
            message: "Blog updated successfully!",
            severity: "success",
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to update blog.",
          severity: "error",
        });
      }
    } else {
      try {
        const res = await axios.post(
          "https://blog-backend-pdhw.onrender.com/blog/addBlog",
          formData
        );
        if (res.status === 200) {
          navigate("/blogs");
          setSnackbar({
            open: true,
            message: "Blog added successfully!",
            severity: "success",
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to add blog.",
          severity: "error",
        });
      }
    }
  };

  // Fetch Blog Data For Update
  const fatchBlogData = async () => {
    const res = await axios.get(
      `https://blog-backend-pdhw.onrender.com/blog/getBlog/${id}`
    );
    setUpdateBlog(res.data.Data);
    setIsEditing(true);
    setImagePreview(res.data.Data.image);
  };

  useEffect(() => {
    if (id) {
      fatchBlogData();
    } else {
      // console.log("No ID provided.");
    }
  }, [id]);

  return (
    <>
      {token ? (
        <>
          {userData ? (
            <Container maxWidth="md" sx={{ py: 8 }}>
              <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                fontFamily="Outfit"
                align="center"
                sx={{
                  fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" }, 
                }}
              >
                Create New Blog Post
              </Typography>

              <StyledPaper>
                <form>
                  <Stack spacing={4}>
                    {/* Title Input */}
                    <TextField
                      label="Blog Title"
                      name="title"
                      fullWidth
                      required
                      variant="outlined"
                      onChange={handleInput}
                      value={value.title}
                    />

                    <TextField
                      label="Author Name"
                      name="author_Name"
                      fullWidth
                      required
                      variant="outlined"
                      onChange={handleInput}
                      value={userData.name}
                      sx={{ display: "none" }}
                    />

                    <TextField
                      type="email"
                      label="Email"
                      name="address"
                      fullWidth
                      required
                      variant="outlined"
                      onChange={handleInput}
                      value={userData.email}
                      sx={{ display: "none" }}
                    />

                    {/* Category Selection with Add Category Button */}
                    <Box sx={{ mb: 2 }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <TextField
                          select
                          label="Category"
                          name="catID"
                          fullWidth
                          required
                          onChange={handleInput}
                          value={value.catID}
                        >
                          {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                              {category.blogCategory}
                            </MenuItem>
                          ))}
                        </TextField>
                        <Button
                          variant="outlined"
                          onClick={() => setShowAddCategory(!showAddCategory)}
                          sx={{ minWidth: "auto", whiteSpace: "nowrap" }}
                        >
                          {showAddCategory ? "Cancel" : "Add New"}
                        </Button>
                      </Stack>

                      {/* Add Category Form */}
                      {showAddCategory && (
                        <Paper
                          sx={{ p: 2, mb: 2, bgcolor: "background.paper" }}
                        >
                          <Stack direction="row" spacing={2}>
                            <TextField
                              fullWidth
                              label="New Category Name"
                              value={blogCategory}
                              onChange={(e) => setBlogCategory(e.target.value)}
                              size="small"
                            />
                            <Button
                              variant="contained"
                              onClick={() => {
                                handleAddCategory();
                                setBlogCategory("");
                                setShowAddCategory(false);
                              }}
                            >
                              Add
                            </Button>
                          </Stack>
                        </Paper>
                      )}
                    </Box>

                    {/* Image Upload */}
                    <Box>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 2 }}
                      >
                        Upload Cover Image
                        <VisuallyHiddenInput
                          type="file"
                          multiple={false}
                          accept="image/*"
                          onChange={handleImage}
                        />
                      </Button>

                      {/* Image Preview */}
                      {imagePreview && (
                        <Box
                          sx={{
                            mt: 2,
                            position: "relative",
                            width: "50%",
                            height: "300px",
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: 3,
                          }}
                        >
                          <img
                            src={
                              image
                                ? URL.createObjectURL(image) // For newly selected image
                                : `https://blog-backend-pdhw.onrender.com/public/images/${imagePreview}` // For existing image
                            }
                            alt="Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            onClick={() => {
                              if (isEditing) {
                                setImage(null);
                                setImagePreview(updateBlog.image);
                              } else {
                                setImagePreview(null);
                                setImage(null);
                              }
                            }}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              bgcolor: "background.paper",
                              "&:hover": {
                                bgcolor: "error.light",
                                color: "white",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}

                      {/* Helper text */}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 1 }}
                      >
                        {image
                          ? `Selected file: ${image.name}`
                          : "No file selected"}
                      </Typography>
                    </Box>

                    {/* Simple Text Area for Content */}
                    <TextField
                      label="Blog Content"
                      name="content"
                      multiline
                      rows={8}
                      fullWidth
                      required
                      variant="outlined"
                      onChange={handleInput}
                      value={value.content}
                      placeholder="Write your blog content here..."
                    />

                    {/* Submit Button */}
                    {updateBlog ? (
                      <>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          sx={{
                            mt: 4,
                            py: 1.5,
                            fontSize: "1.1rem",
                            textTransform: "none",
                          }}
                          // onClick={() => navigate('/blogs')}
                          onClick={handleSubmit}
                        >
                          Update Blog
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          sx={{
                            mt: 4,
                            py: 1.5,
                            fontSize: "1.1rem",
                            textTransform: "none",
                          }}
                          // onClick={() => navigate('/blogs')}
                          onClick={handleSubmit}
                        >
                          Publish Blog
                        </Button>
                      </>
                    )}
                  </Stack>
                </form>
              </StyledPaper>

              {/* Snackbar */}
              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity={snackbar.severity}
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </Container>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </>
      ) : (
        <> {navigate("signup")} </>
      )}
    </>
  );
}

export default PostBlog;
