import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CheckIn = () => {
  const [bookings, setBookings] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const navigate = useNavigate();

  const fetchBookings = () => {
    axios
      .get("http://localhost:3000/api/booking")
      .then((response) => {
        setBookings(response.data.bookings);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  };

 
  useEffect(() => {
    fetchBookings();
  }, [shouldFetch]);

  const handleDownload = async (id) => {
    const pdfUrl = `http://localhost:3000/download/invoice-${id}.pdf`;

    try {
      
      const response = await fetch(pdfUrl, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`; 
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);

    }
  };

  
  const handleCheckIn = (bookingId) => {
    axios
      .post(`http://localhost:3000/api/booking/${bookingId}/check-in`)
      .then((response) => {
        alert("Checked in successfully!");
        
        setShouldFetch((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error during check-in:", error);
      });
  };

  
  const handleDelete = (bookingId) => {
    axios
      .delete(`http://localhost:3000/api/booking/${bookingId}`)
      .then((response) => {
        alert("Booking deleted successfully!");
        
        setShouldFetch((prev) => !prev);
      })
      .catch((error) => {
        console.error("Error during deletion:", error);
      });
  };

  const handleCheckOut = (bookingId) => {
    navigate(`/check-out/${bookingId}`);
  };

  
  const handleEdit = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  return (
    <Container>
      <h1>Bookings List</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Room Number</TableCell>
              <TableCell>Booking Date</TableCell>
              <TableCell>No. of Guests</TableCell>
              <TableCell>Check-in Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.customerId?.name || "Unknown"}</TableCell>
                <TableCell>{booking.roomId.roomNumber}</TableCell>
                <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{booking.numberOfguests}</TableCell>
                <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleCheckIn(booking._id)}
                    disabled={booking.status !== "confirmed"}
                    sx={{my:1}}
                  >
                    Check In
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCheckOut(booking._id)}
                    style={{ marginLeft: 10 , my:1 }}
                  >
                    Check Out
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleEdit(booking._id)}
                    style={{ marginLeft: 10 , my:1}}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(booking._id)}
                    style={{ marginLeft: 10 , my:1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    disabled={booking.status !== "checked-out"}
                    onClick={()=>handleDownload(booking._id)}
                    style={{ marginLeft: 10 , my:1 }}
                  >
                    Download Invoice
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CheckIn;
