import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { currentUser } = UserAuth();
console.log("PrivateRoute user:", currentUser);

  if (currentUser === undefined) {
    // You can return a loader or null
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to={"/login"} />;
  }

  return children;
}


export default PrivateRoute;
