import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const AuthSuccess = () => {
  const { setCurrentUser } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const email = query.get("email");
    const displayName = query.get("displayName");
    const photo = query.get("photo");
  
    if (email) {
      setCurrentUser({ email, displayName, photoURL: photo });
      navigate("/");
    }
  }, [location, navigate, setCurrentUser]);
  
  

  return <p>Logging in...</p>;
};

export default AuthSuccess;
