import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  var isAdmin = false;
  if(token){
    isAdmin = JSON.parse(atob(token.split(".")[1])).isAdmin;
  }
  return isAdmin ? children : <Navigate to="/" />;
};

export default PrivateRoute;