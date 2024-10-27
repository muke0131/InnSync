import React from 'react';
import { Button, Typography, Box, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
    
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            InnSync - Hotel Management System
          </Typography>
        </Toolbar>
      </AppBar>

     
      <Box
        sx={{
          minHeight: '100vh',   
          width: '100%',       
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to InnSync
        </Typography>
        <Typography variant="h5" gutterBottom>
          Manage your hotel check-in and check-out seamlessly
        </Typography>

        {/* Buttons for Login and Register */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginRight: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleRegister}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
