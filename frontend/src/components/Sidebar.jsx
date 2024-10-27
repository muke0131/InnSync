import React from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import CheckInIcon from "@mui/icons-material/ExitToApp";
import CheckOutIcon from "@mui/icons-material/MeetingRoom";
import PaymentIcon from "@mui/icons-material/Payment";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const drawerWidth = 240;

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div style={{position:"relative"}}>
      <Toolbar />
      <List>
        <ListItem button="true" component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button="true" component={Link} to="/customers">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Customers" />
        </ListItem>
        <ListItem button="true" component={Link} to="/rooms">
          <ListItemIcon>
            <CheckInIcon />
          </ListItemIcon>
          <ListItemText primary="Rooms" />
        </ListItem>
        <ListItem button="true" component={Link} to="/bookings">
          <ListItemIcon>
            <CheckOutIcon />
          </ListItemIcon>
          <ListItemText primary="Booking" />
        </ListItem>
        <ListItem button="true" component={Link} to="/payments">
          <ListItemIcon>
            <CheckOutIcon />
          </ListItemIcon>
          <ListItemText primary="Billing" />
        </ListItem>
        <ListItem button="true" component={Link} to="/check-in">
          <ListItemIcon>
            <CheckOutIcon />
          </ListItemIcon>
          <ListItemText primary="Check In" />
        </ListItem>
        <ListItem button="true" component={Link} to="/logout">
          <ListItemIcon>
            <CheckInIcon />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ display: { sm: "none" }, marginLeft: "16px" }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "#1976d2",
            color: "white",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "#1976d2",
            color: "white",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
