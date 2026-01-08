import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutes

const useInactivityLogout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, INACTIVITY_LIMIT);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [logout]);
};

export default useInactivityLogout;
