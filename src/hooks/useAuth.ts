import { useEffect, useState } from "react";
import {
  clearAuth,
  getStoredUser,
  isLoggedIn,
  type StoredUser,
} from "../utils/authStorage";

interface AuthState {
  isLoggedIn: boolean;
  user: StoredUser | null;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [user, setUser] = useState<StoredUser | null>(getStoredUser());

  useEffect(() => {
    const syncAuthState = () => {
      setLoggedIn(isLoggedIn());
      setUser(getStoredUser());
    };

    syncAuthState();

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("auth-changed", syncAuthState as EventListener);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener(
        "auth-changed",
        syncAuthState as EventListener,
      );
    };
  }, []);

  const logout = () => {
    clearAuth();
    setLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
  };

  return {
    isLoggedIn: loggedIn,
    user,
    logout,
  };
}
