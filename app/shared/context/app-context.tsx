"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getAuthSession } from "../lib/auth-storage";
import { getLists } from "../services/list.service";
import { getUnreadCount } from "../services/notification.service";
import type { AuthUser } from "../types/auth";
import type { ShoppingList } from "../types/list";

interface AppContextValue {
  user: AuthUser | null;
  lists: ShoppingList[];
  listsLoading: boolean;
  notificationCount: number;
  refreshLists: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  setNotificationCount: (n: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  const refreshLists = useCallback(async () => {
    try {
      setListsLoading(true);
      const data = await getLists();
      setLists(data);
    } catch {
      setLists([]);
    } finally {
      setListsLoading(false);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setNotificationCount(count);
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    const session = getAuthSession();
    if (session) {
      setUser(session.user);
      refreshLists();
      refreshNotifications();
    } else {
      setListsLoading(false);
    }
  }, [refreshLists, refreshNotifications]);

  return (
    <AppContext.Provider
      value={{
        user,
        lists,
        listsLoading,
        notificationCount,
        refreshLists,
        refreshNotifications,
        setNotificationCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
