import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface UnreadMessagesContextType {
  unreadCount: number;
  addUnread: (count?: number) => void;
  clearUnread: () => void;
  setUnreadCount: (count: number) => void;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType>({
  unreadCount: 0,
  addUnread: () => {},
  clearUnread: () => {},
  setUnreadCount: () => {},
});

export const useUnreadMessages = () => useContext(UnreadMessagesContext);

export const UnreadMessagesProvider = ({ children }: { children: ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const addUnread = useCallback((count = 1) => {
    setUnreadCount(prev => prev + count);
  }, []);

  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return (
    <UnreadMessagesContext.Provider value={{ unreadCount, addUnread, clearUnread, setUnreadCount }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

/** Hook to simulate incoming messages when not on /messages page */
export const useSimulateIncomingMessages = () => {
  const { addUnread } = useUnreadMessages();
  const location = useLocation();

  useEffect(() => {
    // Only simulate incoming messages when NOT on messages page
    if (location.pathname === "/messages") return;

    // Simulate a new message arriving after 8 seconds
    const timer = setTimeout(() => {
      addUnread(1);
    }, 8000);

    // Then every 15 seconds
    const interval = setInterval(() => {
      if (location.pathname !== "/messages") {
        addUnread(1);
      }
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [location.pathname, addUnread]);
};
