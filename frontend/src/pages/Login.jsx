import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../store/auth";

const Login = () => {
  const navigate = useNavigate();
  const { storeToken } = useAuth();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      if (response.ok) {
        const data = await response.json();
        storeToken(data.token);
        setInputs({ email: "", password: "" });
        navigate("/bookings");
        console.log("Login Successful!");
      } else {
        console.error("Invalid credentials!");
      }
    } catch (err) {
      console.error(err);
    }
  };


  const goToRegister = () => {
    navigate('/register');
  };

  return (
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
      <Typography variant="h4" gutterBottom>
        Login to InnSync
      </Typography>

      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '400px',
          backgroundColor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
        onSubmit={handleSubmit}
      >
       
        <TextField
          label="Email"
          name="email"
          type="email"
          value={inputs.email}
          onChange={handleChange}
          required
          margin="normal"
        />

       
        <TextField
          label="Password"
          name="password"
          type="password"
          value={inputs.password}
          onChange={handleChange}
          required
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Login
        </Button>


        <Button
          variant="outlined"
          color="secondary"
          sx={{ marginTop: 2 }}
          onClick={goToRegister}
        >
          Don't have an account? Register
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
