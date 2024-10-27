import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const BookingPage = () => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfguests, setNumberOfGuests] = useState(1);
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate();
  const { id } = useParams(); 
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/room/available", { withCredentials: true })
      .then((response) => {
        setAvailableRooms(response.data);
      })
      .catch((error) => console.error("Error fetching available rooms:", error));

    axios
      .get("http://localhost:3000/api/customer", { withCredentials: true })
      .then((response) => {
        const sortedCustomers = response.data.customers.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCustomers(sortedCustomers);
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }, []);

 
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/api/booking/${id}`)
        .then((response) => {
          const { roomId, customerId, checkInDate, checkOutDate, numberOfguests } = response.data;
          setRoomId(roomId._id);
          setCustomerId(customerId._id);
          setCheckInDate(checkInDate.slice(0, 10)); 
          setCheckOutDate(checkOutDate.slice(0, 10));
          setNumberOfGuests(numberOfguests);
        })
        .catch((error) => console.error("Error fetching booking details:", error));
    }
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      roomId,
      customerId,
      checkInDate,
      checkOutDate,
      numberOfguests,
    };

    try {
      if (id) {
        
        const response = await axios.put(
          `http://localhost:3000/api/booking/${id}`,
          bookingData
        );
        setResponseMessage("Booking updated successfully!");
        navigate('/check-in')

      } else {
        
        const response = await axios.post(
          "http://localhost:3000/api/booking",
          bookingData
        );
        setResponseMessage("Booking successful!");
        navigate('/check-in')
      }
    } catch (error) {
      console.error(
        "Error saving booking:",
        error.response ? error.response.data : error.message
      );
      setResponseMessage(id ? "Update failed." : "Booking failed.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <Typography variant="h4" gutterBottom>
        {id ? "Update Booking" : "Book a Room"}
      </Typography>

      
      <FormControl sx={{ mt: 5, width: "300px" }} required>
        <InputLabel>Select Room</InputLabel>
        <Select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          {availableRooms.map((room) => (
            <MenuItem key={room._id} value={room._id}>
              Room #{room.roomNumber} - {room.category} (₹{room.pricePerNight}
              /night)
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="h6">OR</Typography>

      <Button
        variant="outlined"
        color="primary"
        size="large"
        onClick={() => navigate("/rooms")}
      >
        Add New Room
      </Button>

      
      <FormControl sx={{ mt: 5, width: "300px" }} required>
        <InputLabel>Select Customer</InputLabel>
        <Select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          {customers.map((customer) => (
            <MenuItem key={customer._id} value={customer._id}>
              {customer.name} ({customer.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="h6">OR</Typography>

      <Button
        variant="outlined"
        color="primary"
        size="large"
        onClick={() => navigate("/customers")}
      >
        Add New Customer
      </Button>

      
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "300px",
          backgroundColor: "white",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          mt: 5,
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Check-in Date"
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          margin="normal"
        />
        <TextField
          label="Check-out Date"
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          margin="normal"
        />
        <TextField
          label="Number of Guests"
          type="number"
          value={numberOfguests}
          onChange={(e) => setNumberOfGuests(e.target.value)}
          required
          margin="normal"
        />

        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          {id ? "Update Booking" : "Book Room"}
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

export default BookingPage;
