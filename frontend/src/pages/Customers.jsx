import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/customer');
      if (!response.ok) {
        throw new Error('Failed to fetch customer data');
      }
      const data = await response.json();
      setCustomers(data.customers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/customer/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
      setCustomers(customers.filter((customer) => customer._id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: '16px',position:"relative" }}>
      <Typography variant="h4" gutterBottom>
        Customer List
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/addCustomer')}
        style={{ marginBottom: '16px' }}
      >
        Add Customer
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>ID Type</TableCell>
              <TableCell>ID Number</TableCell>
              <TableCell>OTP Verified</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.idType}</TableCell>
                <TableCell>{customer.idNumber}</TableCell>
                <TableCell>{customer.otpVerified ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => navigate(`/addCustomer/${customer._id}`)}
                    style={{ marginRight: '8px' , marginBottom:'6px'}}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => handleDelete(customer._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CustomerTable;
