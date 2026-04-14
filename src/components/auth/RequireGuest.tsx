import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/authStorage";

interface RequireGuestProps {
  children: React.ReactNode;
}

function RequireGuest({ children }: RequireGuestProps) {
  if (isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default RequireGuest;
