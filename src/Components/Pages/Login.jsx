import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Divider,
} from '@mui/material';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { BiShow, BiHide } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

function Login() {
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#90caf9',
          },
          secondary: {
            main: '#f48fb1',
          },
          background: {
            default: '#0A1929',
            paper: '#1A2027',
          },
          text: {
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.7)',
          },
        },
      }),
    []
  );

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState({
    email: '',
    password: '',
  });

  const handleInputs = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    setError({
      email: '',
      password: '',
    });

    const newErrors = {};
    if (values.email === '') newErrors.email = 'Email is required';
    if (values.password === '') newErrors.password = 'Password is required';

    setError(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    axios
      .post('https://blog-backend-pdhw.onrender.com/users/loginUser', values)
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem('token', token);
        navigate('/blogs');
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.Message;

        if (errorMessage === 'User Not Found') {
          setError({ ...error, email: errorMessage });
        } else if (errorMessage === 'Invalid Password') {
          setError({ ...error, password: errorMessage });
        } else {
          setError({ ...error, email: errorMessage, password: errorMessage });
        }
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          height: '100vh',
          overflow: 'hidden',
          bgcolor: 'background.default',
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container 
          maxWidth="sm"
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ mb: 1, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', sm: '2.5rem' },
                mb: 2,
                mt: -5,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Continue your journey with BlogVerse
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 2,
              bgcolor: 'background.paper',
              color: 'text.primary',
            }}
          >
            <Stack spacing={3}>
              <TextField
                name="email"
                label="Email Address"
                variant="outlined"
                fullWidth
                value={values.email}
                onChange={handleInputs}
                error={!!error.email}
                helperText={error.email}
              />

              <TextField
                name="password"
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleInputs}
                error={!!error.password}
                helperText={error.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        color="inherit"
                      >
                        {showPassword ? <BiHide /> : <BiShow />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  bgcolor: 'primary.main',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={handleSubmit}
              >
                Login
              </Button>

              <Divider>or continue with</Divider>

              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FaGoogle />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FaGithub />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  GitHub
                </Button>
              </Stack>

              <Typography align="center" color="text.secondary">
                Don't have an account?{' '}
                <Button
                  variant="text"
                  onClick={() => navigate('/signup')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
