import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom"; 
const CheckOut = () => {

  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    status: "paid",
    issueDate: "2024-10-15",
    dueDate: "2024-10-15",
    paymentMethod: "cash",
    notes: "Checked out",
  });

  const [bookingDetails, setBookingDetails] = useState({
    totalAmount: 0,
    customerName: "",
    roomNo: "",
  });

  const { id } = useParams(); 
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/booking/${id}`)
      .then((response) => {
        console.log(response.data);
        const info = response.data;
        setBookingDetails({
          totalAmount: info.totalPrice,
          customerName: info.customerId?.name,
          roomNo: info.roomId?.roomNumber,
        });
      })
      .catch((error) => {
        console.error("Error fetching booking details:", error);
      });
  }, [id]); 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`http://localhost:3000/api/booking/${id}/check-out`, formData)
      .then((response) => {
        alert("Check-out successful!");
        
        setPdfUrl(response.data.pdfUrl);

      })
      .catch((error) => {
        console.error("Error during check-out:", error);
        alert("Failed to check out.");
      });
  };

  const handleDownload = async () => {
    

    console.log(`http://localhost:3000${pdfUrl}`)
  
    try {
      
      const response = await fetch(`http://localhost:3000${pdfUrl}`, { method: 'GET' });
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

  const handlePrint = async () => {
  
    try {
      const response = await fetch(`http://localhost:3000${pdfUrl}`, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to download PDF for printing');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print(); 
          printWindow.onafterprint = () => {
            printWindow.close(); 
            window.URL.revokeObjectURL(url); 
          };
        };
      } else {
        console.error('Failed to open print window');
      }
    } catch (error) {
      console.error('Print error:', error);
    }
  };
  

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Check-Out
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total Amount"
                name="totalAmount"
                value={bookingDetails.totalAmount}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Name"
                name="customerName"
                value={bookingDetails.customerName}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Room No."
                name="roomNo"
                value={bookingDetails.roomNo}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="unpaid">Unpaid</MenuItem>
                <MenuItem value="partially_paid">Partially Paid</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Issue Date"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="credit_card">Credit Card</MenuItem>
                <MenuItem value="debit_card">Debit Card</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                <MenuItem value="online">Online</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Check Out
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={handleDownload}
                disabled={!pdfUrl}
                style={{ marginTop: "10px" }}
              >
                Download Invoice
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={handlePrint}
                disabled={!pdfUrl}
                style={{ marginTop: "10px" }}
              >
                Print Invoice
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CheckOut;
