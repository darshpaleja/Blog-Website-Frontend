import React, { useEffect, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  styled,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { FaBook, FaPencilAlt } from "react-icons/fa";
import { MdLogout, MdOutlinePostAdd } from "react-icons/md";
import { Routes, Route, useNavigate } from "react-router-dom";
import Blog from "../Pages/Blog";
import HomePage from "../Pages/HomePage";
import PostBlog from "../Pages/PostBlog";
import { BiUserPlus } from "react-icons/bi";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import ErrorPage from "../Pages/ErrorPage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

function Home() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("theme-mode");
    return savedMode || "dark";
  });
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const getUser = async () => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        axios
          .get(`https://blog-backend-pdhw.onrender.com/users/getUserById/${decodedToken.id}`)
          .then((res) => {
            setUser(res.data.Data);
          })
          .catch((err) => {
            console.log(err, "err");
            localStorage.removeItem("token");
          });
      } catch (error) {
        console.log("Token decode error:", error);
        localStorage.removeItem("token");
      }
    }
  };
  useEffect(() => {
    getUser();
  }, [token]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                primary: {
                  main: "#90caf9",
                },
                secondary: {
                  main: "#f48fb1",
                },
                background: {
                  default: "#0A1929",
                  paper: "#1A2027",
                },
                text: {
                  primary: "#fff",
                  secondary: "rgba(255, 255, 255, 0.7)",
                },
              }
            : {
                primary: {
                  main: "#1976d2",
                },
                secondary: {
                  main: "#e91e63",
                },
                background: {
                  default: "#fff",
                  paper: "#fff",
                },
                text: {
                  primary: "rgba(0, 0, 0, 0.87)",
                  secondary: "rgba(0, 0, 0, 0.6)",
                },
              }),
        },
        transitions: {
          duration: {
            enteringScreen: 200,
            leavingScreen: 195,
          },
        },
      }),
    [mode]
  );

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleThemeToggle = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        className="darsh"
        sx={{
          display: "flex",
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
          transition: "background-color 0.3s, color 0.3s",
        }}
      >
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            bgcolor: mode === "dark" ? "background.paper" : "primary.main",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 5 }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <FaPencilAlt size={20} style={{ marginRight: "10px" }} />
              <Typography variant="h6" noWrap component="div">
                BlogVerse
              </Typography>
            </Box>

            {token ? (
              <>
                <Button
                  variant="contained"
                  startIcon={<MdLogout />}
                  onClick={handleLogout}
                  sx={{
                    mr: 2,
                    background:
                      "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                    transition: "all 1s ease",
                    color: "#fff",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={<BiUserPlus />}
                  onClick={() => navigate("/signup")}
                  sx={{
                    mr: 2,
                    background:
                      "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                    transition: "all 1s ease",
                    color: "#fff",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}

            <IconButton
              sx={{ ml: 1 }}
              onClick={handleThemeToggle}
              color="inherit"
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          onClose={handleDrawerOpen}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              color: 'text.primary',
            },
          }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerOpen}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />

          {/* Profile Section */}
          {token && user && (
            <Box
              sx={{
                width: "100%",
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: open ? "flex-start" : "center",
              }}
            >
              <ListItemButton
                onClick={() => navigate("/profile")}
                sx={{
                  minHeight: 48,
                  width: "100%",
                  borderRadius: 2,
                  justifyContent: open ? "initial" : "center",
                  px: 0.5,
                  mb: 1,
                  "&:hover": {
                    bgcolor: "rgba(144, 202, 249, 0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Avatar
                    src=""
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "primary.main",
                      fontSize: "0.9rem",
                    }}
                  >
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()
                      : ""}
                  </Avatar>
                </ListItemIcon>
                {open && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ fontSize: "12px", mb: 0.2, mt: 0.6 }}
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: "12px",
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                )}
              </ListItemButton>
            </Box>
          )}

          <Divider />

          <List>
            {[
              { text: "Blogs", icon: <FaBook size={"18px"} />, path: "/blogs" },
              {
                text: "Post Blog",
                icon: <MdOutlinePostAdd size={"22px"} />,
                path: "/post-blog",
              },
            ].map((item) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    ...(item.highlight && {
                      background:
                        theme.palette.mode === "dark"
                          ? "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)"
                          : "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                      margin: "10px 16px",
                      borderRadius: "8px",
                      "&:hover": {
                        background:
                          theme.palette.mode === "dark"
                            ? "linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)"
                            : "linear-gradient(45deg, #2196f3 30%, #1976d2 90%)",
                        transform: "scale(1.02)",
                      },
                      transition: "all 0.3s ease",
                    }),
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: item.highlight ? "#fff" : "text.primary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: item.highlight ? "#fff" : "text.primary",
                      "& .MuiTypography-root": {
                        fontWeight: item.highlight ? "bold" : "regular",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <DrawerHeader />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/blogs"
              element={
                token ? (
                  <Blog />
                ) : (
                  <Box
                    sx={{
                      height: "80vh",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 3,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4" gutterBottom>
                      Please login to view blogs
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      You need to be logged in to access the blog section
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/login")}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        px: 4,
                        background:
                          "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Login to Continue
                    </Button>
                  </Box>
                )
              }
            />
            <Route
              path="/post-blog"
              element={
                token ? (
                  <PostBlog />
                ) : (
                  <Box
                    sx={{
                      height: "80vh",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 3,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4" gutterBottom>
                      Please login to create a blog
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      You need to be logged in to create and publish blogs
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/login")}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        px: 4,
                        background:
                          "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Login to Continue
                    </Button>
                  </Box>
                )
              }
            />
            <Route
              path="/edit-blog/:id"
              element={
                token ? (
                  <PostBlog />
                ) : (
                  <Box
                    sx={{
                      height: "80vh",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 3,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4" gutterBottom>
                      Please login to edit blogs
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      You need to be logged in to edit blog posts
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/login")}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        px: 4,
                        background:
                          "linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Login to Continue
                    </Button>
                  </Box>
                )
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
