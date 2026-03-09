import { createContext, useContext, useState, useCallback, ReactNode } from "react";

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
