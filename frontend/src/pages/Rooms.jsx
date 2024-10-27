import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/room/');
        const data = await response.json();
        console.log(data); 
        setRooms(data.rooms || []);  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]);  
        setLoading(false);
      }
    };
  
    fetchRooms();
  }, []);

  
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/room/${id}`, {
        method: 'DELETE',
      });
      setRooms(rooms.filter((room) => room._id !== id));
      alert('Customer deleted successfully!');
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>Room List</Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/addRoom')} 
        style={{ marginBottom: '20px' }}
      >
        Add Room
      </Button>

      <Grid container spacing={2}>
        {rooms.map((room) => (
          <Grid item xs={12} sm={6} md={4} key={room._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Room {room.roomNumber}</Typography>
                <Typography>Category: {room.category}</Typography>
                <Typography>Capacity: {room.capacity} person(s)</Typography>
                <Typography>Price per Night: ${room.pricePerNight}</Typography>
                <Typography>Status: {room.status}</Typography>
                <Typography>Amenities: {room.amenities.join(', ')}</Typography>
                
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => navigate(`/addRoom/${room._id}`)} 
                  style={{ marginRight: '10px', marginTop: '10px' }}
                >
                  Edit
                </Button>
                
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={() => handleDelete(room._id)} 
                  style={{ marginTop: '10px' }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Rooms;
