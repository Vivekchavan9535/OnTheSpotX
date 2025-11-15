import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/userContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoggedIn } = useContext(UserContext);

  // If user not logged in → redirect to login
  if (!isLoggedIn) return <Navigate to="/login" />;

  // If role not allowed → redirect to home
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
