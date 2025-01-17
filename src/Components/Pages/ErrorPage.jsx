import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s, color 0.3s',
        overflow: 'hidden',
      }}
    >
      <Container 
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Error Icon */}
        <ErrorOutlineIcon 
          sx={{ 
            fontSize: { xs: '80px', sm: '100px', md: '120px' },
            color: '#90caf9',
            mb: 2,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                opacity: 1,
              },
              '50%': {
                transform: 'scale(1.1)',
                opacity: 0.7,
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 1,
              },
            },
          }} 
        />

        {/* Error Code */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '5rem', sm: '6rem', md: '8rem' },
            fontWeight: 'bold',
            mb: 1,
            background: 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
          }}
        >
          404
        </Typography>

        {/* Error Message */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            mb: 2,
            fontWeight: 'medium',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            textAlign: 'center',
          }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: '600px',
            mx: 'auto',
            px: 2,
            textAlign: 'center',
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          Oops! The page you're looking for seems to have vanished into the digital void. 
          Let's get you back on track.
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            justifyContent: 'center',
            flexWrap: 'wrap',
            px: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              px: { xs: 3, sm: 4 },
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)',
              textTransform: 'none',
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              fontWeight: 500,
              '&:hover': {
                background: 'linear-gradient(45deg, #64b5f6 30%, #90caf9 90%)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Back to Home
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              px: { xs: 3, sm: 4 },
              py: 1.5,
              borderRadius: 2,
              borderColor: '#90caf9',
              color: 'text.primary',
              textTransform: 'none',
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              fontWeight: 500,
              '&:hover': {
                borderColor: '#64b5f6',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ErrorPage;
