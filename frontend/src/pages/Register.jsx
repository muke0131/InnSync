import React, { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  
  const [inputs, setInputs] = useState({
    username: '',
    contactNo: '',
    email: '',
    password: '',
    confirmPassword: '', 
    role: '',
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    try {
      const response = await fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      if (response.ok) {
        const data = await response.json();
        
        setInputs({
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        navigate("/login");
        console.success("Registration Sucessful!");
      } else {
        console.error("Invalid credentials!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const goToLogin = () => {
    navigate('/login');
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
        Register for InnSync
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
          label="Username"
          name="username"
          value={inputs.username}
          onChange={handleChange}
          required
          margin="normal"
        />


        <TextField
          label="Contact No"
          name="contactNo"
          type="tel"
          value={inputs.contactNo}
          onChange={handleChange}
          required
          margin="normal"
        />


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

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={inputs.confirmPassword}
          onChange={handleChange}
          required
          margin="normal"
        />


        <FormControl margin="normal" required>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={inputs.role}
            onChange={handleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="receptionist">Receptionist</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </Select>
        </FormControl>

     
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Register
        </Button>


        <Button
          variant="outlined"
          color="secondary"
          sx={{ marginTop: 2 }}
          onClick={goToLogin}
        >
          Already have an account? Login
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
