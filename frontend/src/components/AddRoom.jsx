import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Chip } from '@mui/material';
import axios from 'axios';

const AddRoomPage = () => {
  const { id } = useParams();
  const [roomData, setRoomData] = useState({
    roomNumber: '',
    category: '',
    capacity: '',
    pricePerNight: '',
    amenities: [],
    status: '',
  });

  const amenitiesOptions = ['AC', 'Wifi', 'TV', 'Mini-bar', 'Heater'];

  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const fetchRoomData = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:3000/api/room/getRoom/${id}`);
          setRoomData(response.data); 
        } catch (error) {
          console.error('Error fetching room data:', error);
          setResponseMessage('Failed to fetch room details.');
        }
      }
    };

    fetchRoomData();
  }, [id]);

  
  const handleChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  
  const handleAmenitiesChange = (e) => {
    const { value } = e.target;
    setRoomData({
      ...roomData,
      amenities: typeof value === 'string' ? value.split(',') : value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = id ? `http://localhost:3000/api/room/updateRoom/${id}` : 'http://localhost:3000/api/room';
      const method = id ? 'put' : 'post';
      const response = await axios[method](url, roomData);
      console.log('Response:', response.data);
      setResponseMessage(id ? 'Room updated successfully!' : 'Room added successfully!');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setResponseMessage(id ? 'Failed to update room.' : 'Failed to add room.');
    }
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
        {id ? 'Edit Room' : 'Add New Room'}
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
          label="Room Number"
          name="roomNumber"
          value={roomData.roomNumber}
          onChange={handleChange}
          required
          margin="normal"
        />

        <FormControl margin="normal" required>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={roomData.category}
            onChange={handleChange}
          >
            <MenuItem value="standard">Standard</MenuItem>
            <MenuItem value="deluxe">Deluxe</MenuItem>
            <MenuItem value="suite">Suite</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Capacity"
          name="capacity"
          type="number"
          value={roomData.capacity}
          onChange={handleChange}
          required
          margin="normal"
        />

        
        <TextField
          label="Price Per Night"
          name="pricePerNight"
          type="number"
          value={roomData.pricePerNight}
          onChange={handleChange}
          required
          margin="normal"
        />

        
        <FormControl margin="normal" required>
          <InputLabel>Amenities</InputLabel>
          <Select
            name="amenities"
            multiple
            value={roomData.amenities}
            onChange={handleAmenitiesChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} sx={{ m: 0.5 }} />
                ))}
              </Box>
            )}
          >
            {amenitiesOptions.map((amenity) => (
              <MenuItem key={amenity} value={amenity}>
                {amenity}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        
        <FormControl margin="normal" required>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={roomData.status}
            onChange={handleChange}
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="unavailable">Unavailable</MenuItem>
          </Select>
        </FormControl>

        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          {id ? 'Update Room' : 'Add Room'}
        </Button>

        
        {responseMessage && (
          <Typography variant="body2" color="success" sx={{ mt: 2 }}>
            {responseMessage}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AddRoomPage;
