import React, { useRef, useState } from 'react';
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
import ReCAPTCHA from 'react-google-recaptcha';

function SignUpPage() {
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
  const [value, setValue] = useState({
    name: '',
    email: '',
    password: '',
    reCAPTCHAValue: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  const SITE_KEY = "6LfwiuIqAAAAABYBk9rF_nWDvMheSNFxdKpAah5E"
  const reCAPTCHARef = useRef();
  console.log(reCAPTCHARef, 'reCAPTCHARef');
  
  // const [reCAPTCHAValue, setReCAPTCHAValue] = useState('');

  // Handle Input Change
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValue((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevState) => ({ ...prevState, [name]: '' })); 
  };

  // Handle ReCAPTCHA
  const handleReCAPTCHA = (value) => {
    setValue((prevState) => ({ ...prevState, reCAPTCHAValue: value }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(value , 'value');

    if (!value.reCAPTCHAValue) {
      alert('Please verify that you are not a robot.');
      return;
    }

    const newErrors = {};

    if (!value.name) newErrors.name = 'Name is required.';
    if (!value.email) newErrors.email = 'Email is required.';
    if (!value.password) newErrors.password = 'Password is required.';

    setErrors(newErrors); 
    
    if (newErrors.name || newErrors.email || newErrors.password) {
      return;
    }

    try {
      const res = await axios.post('https://blog-backend-pdhw.onrender.com/users/createUser', value);
      console.log(res);
      reCAPTCHARef.current.reset();
      setValue({
        name: '',
        email: '',
        password: '',
        reCAPTCHAValue: '',
      });
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.Message;

      // Map backend errors to specific fields
      if (errorMsg === 'User Already Exists') {
        setErrors((prevState) => ({ ...prevState, email: 'User already exists.' }));
      } else if (errorMsg === 'Password must be at least 8 characters long') {
        setErrors((prevState) => ({ ...prevState, password: 'Password must be at least 8 characters long.' }));
      } else if (errorMsg === 'Invalid Email') {
        setErrors((prevState) => ({ ...prevState, email: 'Invalid email address.' }));
      }
    }
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
                mt : -5
              }}
            >
              Join BlogVerse
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Start your journey of creative writing today
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
                name="name"
                label="Full Name"
                variant="outlined"
                fullWidth
                value={value.name}
                onChange={handleInputs}
                error={!!errors.name}
                helperText={errors.name}
              />

              <TextField
                name="email"
                label="Email Address"
                variant="outlined"
                fullWidth
                value={value.email}
                onChange={handleInputs}
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                name="password"
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={value.password}
                onChange={handleInputs}
                error={!!errors.password}
                helperText={errors.password}
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

              <ReCAPTCHA 
                sitekey={SITE_KEY}
                theme='dark'
                ref={reCAPTCHARef}
                onChange={handleReCAPTCHA}
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
                Create Account
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
                Already have an account?{' '}
                <Button
                  variant="text"
                  onClick={() => navigate('/login')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Login
                </Button>
              </Typography>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default SignUpPage;
