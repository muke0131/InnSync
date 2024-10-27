import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Booking";
import Sidebar from "./components/Sidebar";
import { useAuth } from './store/auth';
import LogOut from "./components/Logout";
import CheckIn from "./pages/CheckIn";
import CheckOut from "./pages/CheckOut";
import AddCustomerPage from "./components/AddCustomer";
import AddRoomPage from "./components/AddRoom";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh" }}>
       
        {isLoggedIn && <div style={{ width: "250px" }}><Sidebar /></div>}

       
        <div style={{ flex: 1, padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/addCustomer" element={<AddCustomerPage />} />
            <Route path="/addCustomer/:id" element={<AddCustomerPage />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/addRoom" element={<AddRoomPage />} />
            <Route path="/addRoom/:id" element={<AddRoomPage />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:id" element={<Bookings />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/check-out/:id" element={<CheckOut />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
