import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel, CircularProgress, Snackbar } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AddCustomerPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    idType: '',
    idNumber: '',
    otpVerified: false,
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isUploading, setIsUploading] = useState(false); 
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false); 
  useEffect(() => {
    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/customer/${id}`);
      setCustomerData(response.data); 
    } catch (error) {
      console.error('Error fetching customer details:', error);
      setErrorMessage('Failed to fetch customer details.');
    }
  };

  const handleChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!otpVerified) {
    //   setErrorMessage('Please verify the phone number with OTP before submitting.');
    //   return;
    // }

    const updatedCustomerData = {
        ...customerData,
        otpVerified: otpVerified,
      };

    setIsLoading(true);
    setErrorMessage('');

    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/customer/${id}`, updatedCustomerData);
        setResponseMessage('Customer updated successfully!');
      } else {
        const response = await axios.post('http://localhost:3000/api/customer', updatedCustomerData);
        setResponseMessage('Customer added successfully!');

        if (selectedFile) {
          await uploadIdImage(response.data.customer._id);
        }
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setErrorMessage(error.response?.data?.message || 'Failed to add/update customer.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async () => {
    setIsOtpSending(true);
    try {
      await axios.post('http://localhost:3000/api/otp/send-otp', {
        mobileNumber: customerData.phoneNumber,
      });
      setOtpSent(true);
      setOtpMessage('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpMessage('Failed to send OTP.');
    } finally {
      setIsOtpSending(false);
    }
  };

  const verifyOtp = async () => {
    setIsOtpVerifying(true);
    try {
      await axios.post('http://localhost:3000/api/otp/verify-phone', { otp });
      setOtpVerified(true);
      setOtpMessage('Phone number verified successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpMessage('Failed to verify OTP.');
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadIdImage = async (customerId) => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);
    try {
      await axios.post(`http://localhost:3000/api/customer/${customerId}/upload-id`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponseMessage('ID Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading ID image:', error);
      setErrorMessage('Failed to upload ID image.');
    } finally {
      setIsUploading(false);
    }
  };

  const startCamera = () => {
    setIsCameraActive(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((error) => {
        console.error("Error accessing the camera: ", error);
        setErrorMessage("Failed to access the camera.");
      });
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        setSelectedFile(new File([blob], "id_image.png", { type: "image/png" }));
        setIsCameraActive(false);
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
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
        {id ? 'Update Customer' : 'Add New Customer'}
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
          label="Name"
          name="name"
          value={customerData.name}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={customerData.email}
          onChange={handleChange}
          required
          margin="normal"
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={customerData.phoneNumber}
            onChange={handleChange}
            required
            margin="normal"
            sx={{ flex: 1 }}
          />
          <Button
            variant="outlined"
            onClick={sendOtp}
            disabled={!customerData.phoneNumber || isOtpSending}
            sx={{ ml: 2, height: 'fit-content', marginTop: 2 }}
          >
            {isOtpSending ? <CircularProgress size={24} /> : 'Send OTP'}
          </Button>
        </Box>

        {otpSent && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={verifyOtp}
              disabled={isOtpVerifying || otpVerified}
              sx={{ mt: 1 }}
            >
              {isOtpVerifying ? <CircularProgress size={24} /> : otpVerified ? 'OTP Verified' : 'Verify OTP'}
            </Button>
          </Box>
        )}

        {otpMessage && (
          <Typography variant="body2" color={otpVerified ? 'success' : 'error'} sx={{ mt: 1 }}>
            {otpMessage}
          </Typography>
        )}

        <TextField
          label="Address"
          name="address"
          value={customerData.address}
          onChange={handleChange}
          required
          margin="normal"
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Type of ID</InputLabel>
          <Select
            name="idType"
            value={customerData.idType}
            onChange={handleChange}
          >
            <MenuItem value="aadhar card">Aadhar Card</MenuItem>
            <MenuItem value="passport">Passport</MenuItem>
            <MenuItem value="voter ID">Voter ID</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="ID Number"
          name="idNumber"
          value={customerData.idNumber}
          onChange={handleChange}
          required
          margin="normal"
        />

        <Button variant="contained" type="submit" disabled={isLoading} sx={{ mt: 2 }}>
          {isLoading ? <CircularProgress size={24} /> : id ? 'Update Customer' : 'Add Customer'}
        </Button>

        {responseMessage && (
          <Typography variant="body2" color="success" sx={{ mt: 1 }}>
            {responseMessage}
          </Typography>
        )}

        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}

        <Button variant="outlined" onClick={startCamera} sx={{ mt: 2 }}>
          Open Camera
        </Button>

        {isCameraActive && (
          <Box>
            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
            <Button variant="contained" onClick={captureImage} sx={{ mt: 2 }}>
              Capture Image
            </Button>
            <Button variant="outlined" onClick={stopCamera} sx={{ mt: 2 }}>
              Stop Camera
            </Button>
          </Box>
        )}

        <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: '16px' }} />
        {isUploading && <CircularProgress size={24} />}
      </Box>

      <Snackbar
        open={Boolean(responseMessage)}
        autoHideDuration={3000}
        onClose={() => setResponseMessage('')}
        message={responseMessage}
      />
    </Box>
  );
};

export default AddCustomerPage;
