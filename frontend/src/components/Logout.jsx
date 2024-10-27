import { useEffect } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'

const LogOut=()=>{
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    logout();
    navigate("/");
    toast.success("Logged Out Successfully!");
  }, []);
  
  return ;
}

export default LogOut