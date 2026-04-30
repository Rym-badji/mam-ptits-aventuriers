import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { accessToken } = useContext(AuthContext);

  if (!accessToken) {
    return <Navigate to="/connexion" />;
  }

  return children;
}

export default PrivateRoute;